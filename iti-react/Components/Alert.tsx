import * as React from 'react'
import { useState } from 'react'
import { confirmable, createConfirmation, ReactConfirmProps } from 'react-confirm'
import { Dialog } from './Dialog'
import { defaults } from 'lodash'

interface Options {
    title?: string
}

const defaultOptions: Partial<Options> = {
    title: 'Alert'
}

interface AlertDialogPresentationProps extends ReactConfirmProps {
    options: Options
}

function AlertDialogPresentation(props: AlertDialogPresentationProps) {
    const { show, confirmation, proceed } = props

    const options = defaults({ ...props.options }, defaultOptions)
    const title = options.title!

    if (!show) return null

    return (
        <Dialog
            title={title}
            onClose={proceed}
            modalFooter={
                <button className="btn btn-primary" onClick={() => proceed()}>
                    OK
                </button>
            }
        >
            {confirmation}
        </Dialog>
    )
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
