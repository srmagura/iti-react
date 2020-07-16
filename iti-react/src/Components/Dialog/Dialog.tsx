﻿import React, { useContext, useEffect, useRef, PropsWithChildren } from 'react'
import useEventListener from '@srmagura/use-event-listener'
import { ItiReactContext } from '../../ItiReactContext'
import { SubmitButton } from '../SubmitButton'

interface ActionDialogProps {
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

export function ActionDialog({
    actionButtonText,
    actionButtonClass,
    cancelButtonText,
    action,
    actionInProgress,
    title,
    modalClass,
    onOpen,
    onClose,
    children,
    focusFirst,
    focusFirstOptions,
    actionButtonEnabled,
    showFooter,
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
                    data-dismiss={actionInProgress || onCancel ? '' : 'modal'}
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

ActionDialog.defaultProps = {
    actionButtonClass: 'btn-primary',
    actionButtonEnabled: true,
    cancelButtonText: 'Cancel',
    showFooter: true,
}

type JQueryWithModal<T> = JQuery<T> & {
    modal(x: 'hide' | { backdrop: 'static'; keyboard: boolean }): void
}

export interface FocusFirstOptions {
    additionalTagNames: string[]
}

interface DialogProps {
    title: React.ReactNode
    onOpen?(): void
    onClose(): void

    modalClass?: string
    modalFooter?: React.ReactNode
    focusFirst?: boolean
    focusFirstOptions?: Partial<FocusFirstOptions>
    allowDismiss?: boolean

    // If you need to close the dialog, call this function rather than simply
    // no longer returning the dialog from your render method. This is necessary for
    // the fade out animation to play.
    closeRef?: React.MutableRefObject<() => void>
}

// Wrapper around Bootstrap 4 dialog
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
    const { closeOnEscapeKeyPress } = useContext(ItiReactContext).dialog

    useEffect(() => {
        if (closeRef) {
            closeRef.current = (): void => {
                if (elementRef.current)
                    ($(elementRef.current) as JQueryWithModal<HTMLDivElement>).modal(
                        'hide'
                    )
            }
        }
    })

    useEventListener('keydown', (e: KeyboardEvent) => {
        if (
            e.key === 'Escape' &&
            allowDismiss &&
            closeOnEscapeKeyPress() &&
            elementRef.current
        ) {
            ;($(elementRef.current) as JQueryWithModal<HTMLDivElement>).modal('hide')
        }
    })

    // dependencies = [] because this effect should only run once. By design, a Dialog
    // instance can only be opened once.
    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        if (!elementRef.current) throw new Error('modal element ref is not initialized.')
        const el = $(elementRef.current) as JQueryWithModal<HTMLDivElement>

        // keyboard: false because we handle closing the modal when Escape is pressed ourselves
        el.modal({
            backdrop: 'static',
            keyboard: false,
        })

        // Focus the first field. autofocus attribute does not work in Bootstrap modals
        if (focusFirst) {
            el.on('shown.bs.modal', () => {
                const selector = [
                    'input',
                    'select',
                    'textarea',
                    ...focusFirstOptions.additionalTagNames,
                ].join(', ')

                el.find(selector)
                    .filter(':not([readonly])')
                    .filter(':not([type="hidden"])')
                    .filter(':not(button.close)')
                    .first()
                    .focus()
            })
        }

        return (): void => {
            if (document.contains(el[0])) {
                el.modal('hide')
            }

            // This cleanup is necessary if the dialog calls onError when mounting
            $('.modal-backdrop').remove()
            $('body').removeClass('modal-open')
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

        $(elementRef.current).on('shown.bs.modal', () => {
            if (onOpenRef.current) onOpenRef.current()
        })
        $(elementRef.current).on('hidden.bs.modal', () => {
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
                            className="close"
                            data-dismiss={allowDismiss ? 'modal' : undefined}
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">{children}</div>
                    {modalFooter && <div className="modal-footer">{modalFooter}</div>}
                </div>
            </div>
        </div>
    )
}
