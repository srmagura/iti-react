﻿import * as React from 'react'
import {
    confirmable,
    createConfirmation,
    ReactConfirmProps
} from 'react-confirm'
import { ActionDialog } from './Dialog'

interface IOptions {
    actionButtonText: string
    actionButtonClass?: string
}

interface IConfirmDialogPresentationProps
    extends React.Props<any>,
    IOptions,
    ReactConfirmProps {
    loading?: boolean
}

// this is throwing a "DOMException failed to remove child" when performing the action.
// it's not actually causing any problems

class ConfirmDialogPresentation extends React.Component<
    IConfirmDialogPresentationProps
    > {
    static defaultProps: Partial<IConfirmDialogPresentationProps> = {
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
        const {
            actionButtonText,
            actionButtonClass,
            show,
            confirmation
        } = this.props
        const loading = this.props.loading!

        const dialogId = 'confirm-dialog'

        return (
            show && (
                <ActionDialog
                    title="Confirm"
                    id={dialogId}
                    onClose={this.dismiss}
                    actionButtonText={actionButtonText}
                    actionButtonClass={actionButtonClass}
                    action={this.proceed}
                    loading={loading}
                >
                    {confirmation}
                </ActionDialog>
            )
        )
    }
}

// confirmable HOC pass props `show`, `dismiss`, `cancel` and `proceed` to your component
const ConfirmableDialog = confirmable(ConfirmDialogPresentation)

const _confirm = createConfirmation(ConfirmableDialog)

export function confirm(confirmation: string, options: IOptions) {
    return _confirm({ ...options, confirmation })
}

interface IConfirmDialogProps extends React.Props<any>, IOptions {
    confirmation: string | React.ReactElement<any>
    proceed: (value?: string) => void
    cancel: (value?: string) => void
    loading?: boolean
}

export const ConfirmDialog: React.SFC<IConfirmDialogProps> = props => {
    const {
        confirmation,
        proceed,
        cancel,
        actionButtonText,
        actionButtonClass,
        loading
    } = props

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
            actionButtonText={actionButtonText}
            actionButtonClass={actionButtonClass}
            show={true}
            loading={loading}
        />
    )
}

ConfirmDialog.defaultProps = {
    loading: false,
}
