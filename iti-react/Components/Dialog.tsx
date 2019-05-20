import * as React from 'react'
import { SubmitButton } from './SubmitButton'

interface ActionDialogProps {
    actionButtonText: string
    actionButtonClass?: string
    actionButtonEnabled?: boolean
    cancelButtonText?: string

    action(): void
    actionInProgress: boolean

    id: string
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
        id,
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
            id={id}
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
    id: string
    title: string

    modalClass?: string
    modalFooter?: React.ReactNode
    onClose(): void
    focusFirst?: boolean
    allowDismiss?: boolean
}

// Wrapper around Bootstrap 4 dialog
export class Dialog extends React.Component<DialogProps, {}> {
    static defaultProps = {
        modalClass: '',
        focusFirst: true,
        allowDismiss: true
    }

    readonly eventName = 'keydown'

    getEl = () => {
        return $('#' + this.props.id) as any
    }

    onKeyPress = (e: KeyboardEvent) => {
        const allowDismiss = this.props.allowDismiss!

        if (e.key === 'Escape' && allowDismiss) {
            this.getEl().modal('hide')
        }
    }

    componentDidMount() {
        const { id, focusFirst, onClose } = this.props

        const el = this.getEl()

        // We handle closing the modal when Escape is pressed ourselves
        el.modal({ backdrop: 'static', keyboard: false })
        document.addEventListener(this.eventName, this.onKeyPress)

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
        const { allowDismiss, modalClass, modalFooter, title, id, children } = this.props

        return (
            <div id={id} className="modal fade" tabIndex={-1} role="dialog">
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

    componentWillUnmount() {
        ;($('.modal') as any).modal('hide')

        // This is necessary to remove the backdrop if the dialog calls onError in
        // componentDidMount()
        $('.modal-backdrop').remove()

        document.removeEventListener(this.eventName, this.onKeyPress)
        this.getEl().off('hidden.bs.modal', this.props.onClose)
    }
}
