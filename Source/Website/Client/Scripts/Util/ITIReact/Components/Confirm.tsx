import * as React from 'react';
import { confirmable, createConfirmation, ReactConfirmProps } from 'react-confirm';
import { ActionDialog } from './Dialog';

interface IOptions {
    actionButtonText: string
    actionButtonClass?: string
}

// this is throwing a "DOMException failed to remove child" when performing the action.
// it's not actually causing any problems

class ConfirmDialogPresentation extends React.Component<IOptions & ReactConfirmProps> {

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
        const { actionButtonText, actionButtonClass,
            show, confirmation } = this.props

        const dialogId = 'confirm-dialog'

        return (show && <ActionDialog
            title="Confirm"
            id={dialogId}
            onClose={this.dismiss}
            actionButtonText={actionButtonText}
            actionButtonClass={actionButtonClass}
            action={this.proceed}
            loading={false}>
            {confirmation}
        </ActionDialog>
        )
    }
}

// confirmable HOC pass props `show`, `dismiss`, `cancel` and `proceed` to your component.
const ConfirmDialog = confirmable(ConfirmDialogPresentation)

const _confirm = createConfirmation(ConfirmDialog)

// This is optional. But I recommend to define your confirm function easy to call.
export function confirm(confirmation: string, options: IOptions) {
    // You can pass whatever you want to the component. These arguments will be your Component's props
    return _confirm({ ...options, confirmation });
}
