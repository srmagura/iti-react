import React, { useContext , useState, PropsWithChildren } from 'react'
import useEventListener from '@use-it/event-listener'
import { ActionDialog } from './Dialog'
import { ItiReactContext } from '../../ItiReactContext'

export interface EasyFormDialogProps<TResponseData> {
    title: React.ReactNode
    actionButtonText: string
    actionButtonEnabled?: boolean
    actionButtonClass?: string

    formIsValid: boolean
    onShowValidationChange(showValidation: boolean): void

    onSuccess(payload: TResponseData | undefined): Promise<void>
    onClose(): void
    onSubmit(): Promise<
        | {
              shouldClose?: boolean
              responseData: TResponseData
          }
        | undefined
    >
    onCancel?(): void

    closeRef?: React.MutableRefObject<() => void>
    modalClass?: string
    focusFirst?: boolean
    showFooter?: boolean
}

export function getGenericEasyFormDialog<TResponseData>() {
    // Dialog component that takes out some of the boilerplate required for forms
    return function EasyFormDialog(
        {
            title,
            actionButtonText,
            actionButtonEnabled = true,
            actionButtonClass,
            formIsValid,
            onShowValidationChange,
            onSuccess,
            modalClass,
            focusFirst,
            onClose,
            onSubmit,
            onCancel,
            showFooter,
            children, closeRef = { current: ():void => { /* no-op */ }}
        }: PropsWithChildren<EasyFormDialogProps<TResponseData>>
    ): React.ReactElement {
        const {onError} = useContext(ItiReactContext).easyFormDialog

        const [submitting, setSubmitting] = useState(false)

        async function submit(): Promise<void> {
            onShowValidationChange(true)
            if (!formIsValid) return

            setSubmitting(true)

            try {
                const onSubmitReturnValue = await onSubmit()

                const shouldClose = onSubmitReturnValue?.shouldClose ?? true
                const responseData = onSubmitReturnValue?.responseData

                if (shouldClose) {
                    // onSuccess may be loading data, so wait for it to finish before hiding the modal
                    // and setting submitting=false
                    await onSuccess(responseData)
                    closeRef.current()
                }
            } catch (e) {
                onError(e)
                return
            }

            setSubmitting(false)
        }

        // Submit form on Ctrl+Enter - convenient when you are typing in a textarea
        // TODO:UI remove type assertions when sam's PR accepted
        useEventListener('keypress', (e: unknown): void => {
            const ke = e as KeyboardEvent

            if (ke.ctrlKey && ke.code === 'Enter') {
                submit()
            }
        })

        return (
            <ActionDialog
                closeRef={closeRef}
                title={title}
                actionButtonText={actionButtonText}
                actionButtonEnabled={actionButtonEnabled}
                actionButtonClass={actionButtonClass}
                action={submit}
                actionInProgress={submitting}
                modalClass={modalClass}
                onClose={onClose}
                focusFirst={focusFirst}
                showFooter={showFooter}
                onCancel={onCancel}
            >
                <form
                    onSubmit={(e): void => {
                        e.preventDefault()
                        submit()
                    }}
                    noValidate
                >
                    {children}
                    {/* So that pressing enter while in the form submits it */}
                    <input type="submit" className="d-none hidden-submit-button" />
                </form>
            </ActionDialog>
        )
    }
}

export const EasyFormDialog = getGenericEasyFormDialog<unknown>()
