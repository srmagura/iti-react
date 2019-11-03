import * as React from 'react'
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
    onClose(): void

    modalClass?: string
    onCancel?(): void
    focusFirst?: boolean
    focusFirstOptions?: Partial<FocusFirstOptions>
    showFooter?: boolean
    closeRef?: React.MutableRefObject<() => void>
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
        focusFirstOptions,
        actionButtonEnabled,
        showFooter,
        onCancel,
        closeRef
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
            closeRef={closeRef}
            modalClassName={modalClass}
            modalFooter={footer}
            onClose={onClose}
            children={children}
            focusFirst={focusFirst}
            focusFirstOptions={focusFirstOptions}
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

export interface FocusFirstOptions {
    additionalTagNames: string[]
}

interface DialogProps {
    title: string
    onClose(): void

    modalClassName?: string
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
export function Dialog(props: PropsWithChildren<DialogProps>) {
    const { title, onClose, modalFooter, children, closeRef } = props
    const modalClass = props.modalClassName!
    const focusFirst = props.focusFirst!
    const allowDismiss = props.allowDismiss!

    const focusFirstOptions = { additionalTagNames: [], ...props.focusFirstOptions }

    const elementRef = useRef<HTMLDivElement | null>(null)
    const closeOnEscapeKeyPress = useContext(ItiReactContext).dialog.closeOnEscapeKeyPress

    useEffect(() => {
        if (closeRef) {
            closeRef.current = () => {
                if (elementRef.current) ($(elementRef.current) as any).modal('hide')
            }
        }
    })

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
                const selector = [
                    'input',
                    'select',
                    'textarea',
                    ...focusFirstOptions.additionalTagNames
                ].join(', ')

                el.find(selector)
                    .filter(':not([readonly])')
                    .filter(':not([type="hidden"])')
                    .filter(':not(button.close)')
                    .first()
                    .focus()
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
    modalClassName: '',
    focusFirst: true,
    allowDismiss: true
}
