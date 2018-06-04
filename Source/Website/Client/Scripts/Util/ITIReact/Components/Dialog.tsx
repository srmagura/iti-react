import * as React from 'react'
import { SubmitButton } from './SubmitButton'

interface IActionDialogProps extends React.Props<any> {
    actionButtonText: string
    actionButtonClass?: string
    actionButtonEnabled?: boolean
    action(): void
    loading: boolean

    id: string
    title: string

    modalClass?: string
    onClose(): void
    focusFirst?: boolean
}

// FYI: you can still close a modal with loading=true by focusing one of the fields and pressing escape.
// Ideally we should prevent this, white still letting escape close the dialog if loading=false.

export const ActionDialog: React.SFC<IActionDialogProps> = props => {
    const {
        actionButtonText,
        actionButtonClass,
        action,
        loading,
        id,
        title,
        modalClass,
        onClose,
        children,
        focusFirst,
        actionButtonEnabled
    } = props

    const footer = [
        <SubmitButton
            type="button"
            onClick={action}
            className={`btn ${actionButtonClass}`}
            submitting={loading}
            enabled={actionButtonEnabled}
            key="action"
        >
            {actionButtonText}
        </SubmitButton>,
        <button
            type="button"
            className="btn btn-secondary"
            data-dismiss={loading ? '' : 'modal'}
            key="cancel"
        >
            Cancel
        </button>
    ]

    return (
        <Dialog
            id={id}
            title={title}
            modalClass={modalClass}
            modalFooter={footer}
            onClose={onClose}
            children={children}
            focusFirst={focusFirst}
            allowDismiss={!loading}
        />
    )
}

ActionDialog.defaultProps = {
    actionButtonClass: 'btn-primary',
    actionButtonEnabled: true
}

interface IDialogProps extends React.Props<any> {
    id: string
    title: string

    modalClass?: string
    modalFooter?: React.ReactNode
    onClose(): void
    focusFirst?: boolean
    allowDismiss?: boolean
}

// Wrapper around Bootstrap 4 dialog
export class Dialog extends React.Component<IDialogProps, {}> {
    static defaultProps = {
        modalClass: '',
        focusFirst: true,
        allowDismiss: true
    }

    componentDidMount() {
        const { id, focusFirst, onClose } = this.props

        const el = $('#' + id) as any
        el.modal({ backdrop: 'static' })
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
    }

    render() {
        const {
            allowDismiss,
            modalClass,
            modalFooter,
            title,
            id,
            children
        } = this.props

        return (
            <div id={id} className="modal fade" role="dialog">
                <div className={'modal-dialog ' + modalClass} role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button
                                type="button"
                                className="close"
                                data-dismiss={
                                    allowDismiss ? 'modal' : undefined
                                }
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">{children}</div>
                        {modalFooter && (
                            <div className="modal-footer">{modalFooter}</div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    componentWillUnmount() {
        ;($('.modal') as any).modal('hide')
    }
}
