import React, { useEffect, useRef, PropsWithChildren, useState, useCallback } from 'react'
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
    closeRef: propsCloseRef,
}: PropsWithChildren<ActionDialogProps>): React.ReactElement {
    const internalCloseRef = useRef(() => {})
    const closeRef = propsCloseRef ?? internalCloseRef

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
                        if (actionInProgress) return
                        if (onCancel) onCancel()
                        closeRef.current()
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
            closeRef={closeRef}
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
    const modalRef = useRef<{ dialog: HTMLDivElement } | null>(null)

    const [show, setShow] = useState(true)

    useEffect(() => {
        if (!closeRef) return

        closeRef.current = () => setShow(false)
    })

    const onOpenRef = useRef(onOpen)

    useEffect(() => {
        onOpenRef.current = onOpen
    })

    const onEntered = useCallback((): void => {
        if (focusFirst && modalRef.current) focusFirstInput(modalRef.current.dialog)
        if (onOpenRef.current) onOpenRef.current()
    }, [focusFirst])

    return (
        <Modal
            show={show}
            onHide={() => {
                if (allowDismiss) setShow(false)
            }}
            onEntered={onEntered}
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
