import React from 'react'
import { useRef } from 'react'
import { confirmable, createConfirmation, ReactConfirmProps } from 'react-confirm'
import { Dialog } from './Dialog'
import { defaults } from 'lodash'
import useEventListener from '@use-it/event-listener'

interface Options {
    title?: string
}

const defaultOptions: Partial<Options> = {
    title: 'Alert'
}

// When testing, make sure the dialog fades out when closed, instead
// of suddenly disappearing

interface AlertDialogPresentationProps extends ReactConfirmProps {
    options: Options
}

function AlertDialogPresentation(props: AlertDialogPresentationProps) {
    const { show, confirmation, proceed } = props

    const options = defaults({ ...props.options }, defaultOptions)
    const title = options.title!

    const closeRef = useRef(() => {})

    useEventListener('keypress', e => {
        if (((e as any) as KeyboardEvent).key === 'Enter') {
            closeRef.current()
        }
    })

    if (!show) return null

    return (
        <Dialog
            title={title}
            onClose={proceed}
            modalFooter={
                <button className="btn btn-primary" onClick={() => closeRef.current()}>
                    OK
                </button>
            }
            closeRef={closeRef}
            focusFirst
            focusFirstOptions={{ additionalTagNames: ['button'] }}
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
