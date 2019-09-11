﻿import * as React from 'react'
import { useContext, useEffect, useRef, PropsWithChildren } from 'react'
import { SubmitButton } from './SubmitButton'
import { ItiReactContext } from '@interface-technologies/iti-react/ItiReactContext'
import useEventListener from '@use-it/event-listener'

interface ActionDialogProps {
    actionButtonText: string
    actionButtonClass?: string
    actionButtonEnabled?: boolean
    cancelButtonText?: string

    action(): void
    actionInProgress: boolean

    title: string

    modalClass?: string
    onClose(): void
    onCancel?(): void
    focusFirst?: boolean
    showFooter?: boolean
}

export const ActionDialog: React.SFC<ActionDialogProps> = props => {
    const {
        actionButtonText,
        actionButtonClass,
        cancelButtonText,
        action,
        actionInProgress,
        title,
        modalClass,
        onClose,
        children,
        focusFirst,
        actionButtonEnabled,
        showFooter,
        onCancel
    } = props

    let footer

    if (showFooter) {
        footer = [
            <SubmitButton
                type="button"
                onClick={action}
                className={`btn ${actionButtonClass}`}
                submitting={actionInProgress}
                enabled={actionButtonEnabled}
                key="action"
            >
                {actionButtonText}
            </SubmitButton>,
            <button
                type="button"
                className="btn btn-secondary"
                data-dismiss={actionInProgress || onCancel ? '' : 'modal'}
                onClick={onCancel}
                key="cancel"
            >
                {cancelButtonText}
            </button>
        ]
    }

    return (
        <Dialog
            title={title}
            modalClass={modalClass}
            modalFooter={footer}
            onClose={onClose}
            children={children}
            focusFirst={focusFirst}
            allowDismiss={!actionInProgress}
        />
    )
}

ActionDialog.defaultProps = {
    actionButtonClass: 'btn-primary',
    actionButtonEnabled: true,
    cancelButtonText: 'Cancel',
    showFooter: true
}

interface DialogProps {
    title: string

    modalClass?: string
    modalFooter?: React.ReactNode
    onClose(): void
    focusFirst?: boolean
    allowDismiss?: boolean
}

// Wrapper around Bootstrap 4 dialog
export function Dialog(props: PropsWithChildren<DialogProps>) {
    const { title, onClose, modalFooter, children } = props
    const modalClass = props.modalClass!
    const focusFirst = props.focusFirst!
    const allowDismiss = props.allowDismiss!

    const elementRef = useRef<HTMLDivElement | null>(null)
    const closeOnEscapeKeyPress = useContext(ItiReactContext).dialog.closeOnEscapeKeyPress

    useEventListener('keydown', e => {
        // todo: remove type assertions when sam's PR accepted
        const e2 = (e as any) as KeyboardEvent

        if (
            e2.key === 'Escape' &&
            allowDismiss &&
            closeOnEscapeKeyPress() &&
            elementRef.current
        ) {
            ;($(elementRef.current) as any).modal('hide')
        }
    })

    useEffect(() => {
        if (!elementRef.current) throw new Error('modal element ref is not initialized.')
        const el = $(elementRef.current)

            // keyboard: false because we handle closing the modal when Escape is pressed ourselves
        ;(el as any).modal({ backdrop: 'static', keyboard: false })

        el.on('hidden.bs.modal', onClose)

        // Focus the first field. autofocus attribute does not work in Bootstrap modals
        if (focusFirst) {
            el.on('shown.bs.modal', () => {
                const firstInput = el
                    .find('input, select, textarea')
                    .filter(':not([readonly])')
                    .filter(':not([type="hidden"])')
                    .first()

                if (firstInput.attr('type') !== 'radio') {
                    firstInput.focus()
                }
            })
        }

        return () => {
            if (elementRef.current) {
                ;($(elementRef.current) as any).modal('hide')
            }

            // This is necessary to remove the backdrop if the dialog calls onError in
            // when mounting
            $('.modal-backdrop').remove()
        }
    }, [])

    return (
        <div ref={elementRef} className="modal fade" tabIndex={-1} role="dialog">
            <div className={'modal-dialog ' + modalClass} role="document">
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

Dialog.defaultProps = {
    modalClass: '',
    focusFirst: true,
    allowDismiss: true
}
