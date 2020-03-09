import React from 'react'
import { useRef } from 'react'
import { confirmable, createConfirmation, ReactConfirmProps } from 'react-confirm'
import { ActionDialog } from './Dialog'
import { defaults } from 'lodash'

interface Options {
    title?: React.ReactNode
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

function ConfirmDialogPresentation(
    props: ConfirmDialogPresentationProps
): React.ReactElement | null {
    const { show, confirmation, loading } = defaults({ ...props }, { loading: false })

    const closeRef = useRef(() => {
        /* no-op */
    })
    const proceedCalledRef = useRef(false)

    function proceed(): void {
        proceedCalledRef.current = true
        closeRef.current()
    }

    function onClose(): void {
        if (proceedCalledRef.current) {
            props.proceed()
        } else {
            // important: we want to be able to await our confirm function, so call cancel
            // instead of dismiss so that closing the dialog results in the promise being rejected.
            // react-confirm does not resolve or reject if you call dismiss()
            props.cancel()
        }
    }

    const { cancelButtonText, actionButtonText, actionButtonClass, title } = defaults(
        { ...props.options },
        defaultOptions
    )

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

// Matches the type in ReactConfirmProps (@types/react-confirm)
type Confirmation = string | React.ReactElement

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
    } = defaults({ ...props }, { loading: false })

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
            dismiss={(): void => {
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
