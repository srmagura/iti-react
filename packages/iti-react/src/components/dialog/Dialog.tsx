import React, { useEffect, useRef, PropsWithChildren, useState } from 'react'
import useEventListener from '@use-it/event-listener'
import Modal from 'react-bootstrap/Modal'
import { SubmitButton } from '../SubmitButton'
import { focusFirstInput } from '../../util'

export interface ActionDialogProps {
    actionButtonText: string
    actionButtonClass?: string
    actionButtonEnabled?: boolean
    cancelButtonText?: string

    action(): void
    actionInProgress: boolean

    title: React.ReactNode
    onOpen?(): void
    onClose(): void

    modalClass?: string
    onCancel?(): void
    focusFirst?: boolean
    showFooter?: boolean
    closeRef?: React.MutableRefObject<() => void>
}

/**
 * A [[`Dialog`]] that has an action button and a cancel button.
 */
export function ActionDialog({
    actionButtonText,
    actionButtonClass = 'btn-primary',
    cancelButtonText = 'Cancel',
    action,
    actionInProgress,
    title,
    modalClass,
    onOpen,
    onClose,
    children,
    focusFirst,
    actionButtonEnabled = true,
    showFooter = true,
    onCancel,
    closeRef = { current: noop },
}: PropsWithChildren<ActionDialogProps>): React.ReactElement {
    const internalCloseRef = useRef(() => {})

    let footer

    if (showFooter) {
        footer = (
            <>
                <SubmitButton
                    type="button"
                    onClick={action}
                    className={`btn ${actionButtonClass ?? ''}`}
                    submitting={actionInProgress}
                    enabled={actionButtonEnabled}
                >
                    {actionButtonText}
                </SubmitButton>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                        onCancel()
                        const realCloseRef
                    }}
                >
                    {cancelButtonText}
                </button>
            </>
        )
    }

    return (
        <Dialog
            title={title}
            closeRef={closeRef ?? internalCloseRef}
            dialogClassName={modalClass}
            footer={footer}
            onOpen={onOpen}
            onClose={onClose}
            focusFirst={focusFirst}
            allowDismiss={!actionInProgress}
        >
            {children}
        </Dialog>
    )
}

export interface FocusFirstOptions {
    additionalTagNames: string[]
}

export interface DialogProps {
    title: React.ReactNode
    onOpen?(): void
    onClose(): void

    dialogClassName?: string
    footer?: React.ReactNode
    focusFirst?: boolean
    allowDismiss?: boolean

    /**
     * If you need to close the dialog, call this function rather than simply
     * no longer returning the dialog from your render method. This is necessary for
     * the fade out animation to play.
     */
    closeRef?: React.MutableRefObject<() => void>
}

/**
 * Wrapper around the Bootstrap dialog component.
 *
 * - **DO NOT** unmount the dialog except in the `onClose` function. This will cause
 *   the dialog to be abruptly removed without an animation.
 * - Use `closeRef` to close the dialog from the parent component.
 * - The first input element is automatically focused when the dialog opens. This can be
 *   controlled with the `focusFirst` and `focusFirstOptions` props.
 */
export function Dialog({
    title,
    onOpen,
    onClose,
    footer,
    children,
    closeRef,
    dialogClassName,
    focusFirst = true,
    allowDismiss = true,
}: PropsWithChildren<DialogProps>): React.ReactElement {
    // useEffect(() => {
    //     if (closeRef) {
    //         closeRef.current = (): void => {
    //             if (modalRef.current) modalRef.current.hide()
    //         }
    //     }
    // })

    // useEventListener('keydown', (e: KeyboardEvent) => {
    //     if (e.key === 'Escape' && allowDismiss && modalRef.current) {
    //         if (modalRef.current) modalRef.current.hide()
    //     }
    // })

    // // dependencies = [] because this effect should only run once. By design, a Dialog
    // // instance can only be opened once.
    // /* eslint-disable react-hooks/exhaustive-deps */
    // useEffect(() => {
    //     const el = modalRef.current
    //     if (!el) throw new Error('modal element ref is not initialized.')

    //     // keyboard: false because we handle closing the modal when Escape is pressed ourselves
    //     modalRef.current = new bootstrap.Modal(el, {
    //         backdrop: 'static',
    //         keyboard: false,
    //     })
    //     modalRef.current.show()

    //     if (!focusFirst) return undefined

    //     // Focus the first field. autofocus attribute does not work in Bootstrap modals
    //     function shownHandler(): void {
    //         if (!el) throw new Error('el is null. Should be impossible.')

    //         focusFirstInput(el)
    //     }

    //     el.addEventListener('shown.bs.modal', shownHandler)

    //     return () => {
    //         el.removeEventListener('shown.bs.modal', shownHandler)
    //     }
    // }, [])
    // /* eslint-enable react-hooks/exhaustive-deps */

    // const onOpenRef = useRef(onOpen)
    // const onCloseRef = useRef(onClose)
    // useEffect(() => {
    //     onOpenRef.current = onOpen
    //     onCloseRef.current = onClose
    // })

    // useEffect(() => {
    //     if (!modalRef.current) throw new Error('modal element ref is not initialized.')

    //     modalRef.current.addEventListener('shown.bs.modal', () => {
    //         if (onOpenRef.current) onOpenRef.current()
    //     })
    //     modalRef.current.addEventListener('hidden.bs.modal', () => {
    //         onCloseRef.current()
    //     })
    // }, [])

    const modalRef = useRef<HTMLDivElement>(null)

    const [show, setShow] = useState(true)

    function onHide(): void {
        if (allowDismiss) setShow(false)
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            onExited={onClose}
            ref={modalRef}
            backdrop="static"
            dialogClassName={dialogClassName}
        >
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            {footer && <Modal.Footer>{footer}</Modal.Footer>}
        </Modal>
    )
}

export function cleanUpImproperlyClosedDialog(): void {
    document.body.classList.remove('modal-open')
    document.body.removeAttribute('style')

    const backdrop = document.querySelector('.modal-backdrop')
    if (backdrop && backdrop.parentElement) {
        backdrop.parentElement.removeChild(backdrop)
    }
}
