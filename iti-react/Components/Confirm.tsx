import * as React from 'react'
import { confirmable, createConfirmation, ReactConfirmProps } from 'react-confirm'
import { ActionDialog } from './Dialog'
import { defaults } from 'lodash'

interface Options {
    title?: string
    actionButtonText: string
    actionButtonClass?: string
    cancelButtonText?: string
}

const defaultOptions: Partial<Options> = {
    title: 'Confirm'
}

interface ConfirmDialogPresentationProps extends ReactConfirmProps {
    options: Options
    loading?: boolean
}

class ConfirmDialogPresentation extends React.Component<ConfirmDialogPresentationProps> {
    static defaultProps: Pick<ConfirmDialogPresentationProps, 'loading'> = {
        loading: false
    }

    proceedCalled = false

    proceed = () => {
        this.proceedCalled = true
        this.props.proceed()
    }

    dismiss = () => {
        if (!this.proceedCalled) {
            // important #1: we want to be able to await our confirm function, so call cancel
            // instead of dismiss so that closing the dialog results in the promise being rejected.
            // react-confirm does not resolve or reject if you call dismiss()
            //
            // important #2: don't call cancel if proceed has already been called.
            this.props.cancel()
        }
    }

    render() {
        const { show, confirmation } = this.props
        const loading = this.props.loading!

        const options = defaults(this.props.options, defaultOptions)
        const { cancelButtonText, actionButtonText, actionButtonClass } = options
        const title = options.title!

        const dialogId = 'confirm-dialog'

        return (
            show && (
                <ActionDialog
                    title={title}
                    id={dialogId}
                    onClose={this.dismiss}
                    actionButtonText={actionButtonText}
                    actionButtonClass={actionButtonClass}
                    cancelButtonText={cancelButtonText}
                    action={this.proceed}
                    actionInProgress={loading}
                >
                    {confirmation}
                </ActionDialog>
            )
        )
    }
}

// Matches the type in ReactConfirmProps (@types/react-confirm)
type Confirmation = string | React.ReactElement<any>

// confirmable HOC pass props `show`, `dismiss`, `cancel` and `proceed` to your component
const ConfirmableDialog = confirmable(ConfirmDialogPresentation)

const _confirm = createConfirmation(ConfirmableDialog)

export function confirm(confirmation: Confirmation, options: Options): Promise<void> {
    return _confirm({ options, confirmation }).then(() => undefined) // ignore return value
}

interface ConfirmDialogProps extends Options {
    confirmation: Confirmation
    proceed: (value?: string) => void
    cancel: (value?: string) => void
    loading?: boolean
}

export const ConfirmDialog: React.SFC<ConfirmDialogProps> = props => {
    const {
        confirmation,
        proceed,
        cancel,
        actionButtonText,
        actionButtonClass,
        loading,
        title,
        cancelButtonText
    } = props

    const options: Options = {
        title,
        actionButtonText,
        actionButtonClass,
        cancelButtonText
    }

    return (
        <ConfirmDialogPresentation
            confirmation={confirmation}
            proceed={proceed}
            cancel={cancel}
            dismiss={() => {
                throw new Error(
                    'ConfirmDialogPresentation called dismiss(). This should never happen!'
                )
            }}
            show={true}
            loading={loading}
            options={options}
        />
    )
}

ConfirmDialog.defaultProps = {
    loading: false
}
