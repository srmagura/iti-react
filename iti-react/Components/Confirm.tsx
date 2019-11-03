import * as React from 'react'
import { useRef, useEffect } from 'react'
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

// When testing, make sure the dialog fades out when closed, instead
// of suddenly disappearing

interface ConfirmDialogPresentationProps extends ReactConfirmProps {
    options: Options
    loading?: boolean
}

function ConfirmDialogPresentation(props: ConfirmDialogPresentationProps) {
    const { show, confirmation } = props
    const loading = props.loading!

    const closeRef = useRef(() => {})
    const proceedCalledRef = useRef(false)

    function proceed() {
        proceedCalledRef.current = true
        closeRef.current()
    }

    function onClose() {
        if (proceedCalledRef.current) {
            props.proceed()
        } else {
            // important: we want to be able to await our confirm function, so call cancel
            // instead of dismiss so that closing the dialog results in the promise being rejected.
            // react-confirm does not resolve or reject if you call dismiss()
            props.cancel()
        }
    }

    const options = defaults({ ...props.options }, defaultOptions)
    const { cancelButtonText, actionButtonText, actionButtonClass } = options
    const title = options.title!

    if (!show) return null

    return (
        <ActionDialog
            title={title}
            onClose={onClose}
            closeRef={closeRef}
            actionButtonText={actionButtonText}
            actionButtonClass={actionButtonClass}
            cancelButtonText={cancelButtonText}
            action={proceed}
            actionInProgress={loading}
            focusFirst
            focusFirstOptions={{ additionalTagNames: ['button'] }}
        >
            {confirmation}
        </ActionDialog>
    )
}

ConfirmDialogPresentation.defaultProps = { loading: false }

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

// Standalone confirm dialog that does not use react-confirm
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
