﻿import React, { useEffect, useRef, PropsWithChildren } from 'react'
import useEventListener from '@use-it/event-listener'
import * as bootstrap from 'bootstrap'
import { SubmitButton } from '../SubmitButton'

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
    focusFirstOptions?: Partial<FocusFirstOptions>
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
    focusFirstOptions,
    actionButtonEnabled = true,
    showFooter = true,
    onCancel,
    closeRef,
}: PropsWithChildren<ActionDialogProps>): React.ReactElement {
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
                    data-bs-dismiss={actionInProgress || onCancel ? '' : 'modal'}
                    onClick={onCancel}
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
            modalClass={modalClass}
            modalFooter={footer}
            onOpen={onOpen}
            onClose={onClose}
            focusFirst={focusFirst}
            focusFirstOptions={focusFirstOptions}
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

    modalClass?: string
    modalFooter?: React.ReactNode
    focusFirst?: boolean
    focusFirstOptions?: Partial<FocusFirstOptions>
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
    modalFooter,
    children,
    closeRef,
    modalClass = '',
    focusFirst = true,
    allowDismiss = true,
    ...otherProps
}: PropsWithChildren<DialogProps>): React.ReactElement {
    const focusFirstOptions = { additionalTagNames: [], ...otherProps.focusFirstOptions }

    const elementRef = useRef<HTMLDivElement>(null)
    const modalRef = useRef<bootstrap.Modal>()

    useEffect(() => {
        if (closeRef) {
            closeRef.current = (): void => {
                if (modalRef.current) modalRef.current.hide()
            }
        }
    })

    useEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Escape' && allowDismiss && elementRef.current) {
            if (modalRef.current) modalRef.current.hide()
        }
    })

    // dependencies = [] because this effect should only run once. By design, a Dialog
    // instance can only be opened once.
    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        const el = elementRef.current
        if (!el) throw new Error('modal element ref is not initialized.')

        // keyboard: false because we handle closing the modal when Escape is pressed ourselves
        modalRef.current = new bootstrap.Modal(el, {
            backdrop: 'static',
            keyboard: false,
        })
        modalRef.current.show()

        if (!focusFirst) return

        // Focus the first field. autofocus attribute does not work in Bootstrap modals
        function shownHandler(): void {
            if (!el) throw new Error('el is null. Should be impossible.')

            const selector = [
                'input',
                'select',
                'textarea',
                ...focusFirstOptions.additionalTagNames,
            ].join(', ')

            /* eslint-disable  @typescript-eslint/no-unnecessary-type-assertion -- there is a lint bug that keeps removing the type assertion */
            const candidates = Array.from(el.querySelectorAll(selector)) as HTMLElement[]
            /* eslint-enable  @typescript-eslint/no-unnecessary-type-assertion */

            for (const candidate of candidates) {
                if (candidate.classList.contains('btn-close')) continue
                if (candidate.hasAttribute('readonly')) continue
                if (candidate.hasAttribute('disabled')) continue
                if (candidate.getAttribute('type') === 'hidden') continue

                candidate.focus()
                break
            }
        }

        el.addEventListener('shown.bs.modal', shownHandler)

        return () => {
            el.removeEventListener('shown.bs.modal', shownHandler)
        }
    }, [])
    /* eslint-enable react-hooks/exhaustive-deps */

    const onOpenRef = useRef(onOpen)
    const onCloseRef = useRef(onClose)
    useEffect(() => {
        onOpenRef.current = onOpen
        onCloseRef.current = onClose
    })

    useEffect(() => {
        if (!elementRef.current) throw new Error('modal element ref is not initialized.')

        elementRef.current.addEventListener('shown.bs.modal', () => {
            if (onOpenRef.current) onOpenRef.current()
        })
        elementRef.current.addEventListener('hidden.bs.modal', () => {
            onCloseRef.current()
        })
    }, [])

    return (
        <div ref={elementRef} className="modal fade" tabIndex={-1} role="dialog">
            <div className={`modal-dialog ${modalClass}`} role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss={allowDismiss ? 'modal' : undefined}
                            aria-label="Close"
                        />
                    </div>
                    <div className="modal-body">{children}</div>
                    {modalFooter && <div className="modal-footer">{modalFooter}</div>}
                </div>
            </div>
        </div>
    )
}

export function cleanupImproperlyClosedDialog(): void {
    document.body.classList.remove('modal-open')
    document.body.removeAttribute('style')

    const backdrop = document.querySelector('.modal-backdrop')
    if (backdrop && backdrop.parentElement) {
        backdrop.parentElement.removeChild(backdrop)
    }
}
