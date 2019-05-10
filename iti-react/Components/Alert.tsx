import * as React from 'react'
import { confirmable, createConfirmation, ReactConfirmProps } from 'react-confirm'
import { Dialog } from './Dialog'
import { defaults } from 'lodash'
import { getGuid } from '..'

interface Options {
    title?: string
}

const defaultOptions: Partial<Options> = {
    title: 'Alert'
}

interface AlertDialogPresentationProps extends ReactConfirmProps {
    options: Options
}

class AlertDialogPresentation extends React.Component<AlertDialogPresentationProps> {
    readonly dialogId = getGuid()
    proceedCalled = false

    close = () => {
        ;($('#' + this.dialogId) as any).modal('hide')
    }

    render() {
        const { show, confirmation } = this.props

        const options = defaults(this.props.options, defaultOptions)
        const title = options.title!

        return (
            show && (
                <Dialog
                    title={title}
                    id={this.dialogId}
                    onClose={this.props.proceed}
                    modalFooter={
                        <button className="btn btn-primary" onClick={this.close}>
                            OK
                        </button>
                    }
                >
                    {confirmation}
                </Dialog>
            )
        )
    }
}

// Using react-confirm here since it takes care of mounting the dialog outside
// of the main component tree

// Matches the type in ReactConfirmProps (@types/react-confirm)
type Content = string | React.ReactElement<any>

// confirmable HOC pass props `show`, `dismiss`, `cancel` and `proceed` to your component
const ConfirmableDialog = confirmable(AlertDialogPresentation)

const _confirm = createConfirmation(ConfirmableDialog)

export function alert(content: Content, options?: Options): Promise<void> {
    return _confirm({ options, confirmation: content }).then(() => undefined) // ignore return value
}
