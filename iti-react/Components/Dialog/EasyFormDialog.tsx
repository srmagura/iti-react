import React, { useContext } from 'react'
import { useState, useRef, PropsWithChildren } from 'react'
import { ActionDialog } from './Dialog'
import { defaults } from 'lodash'
import useEventListener from '@use-it/event-listener'
import { formToObject } from '../../Util'
import { ItiReactContext } from '../../ItiReactContext'

export interface EasyFormDialogProps {
    title: React.ReactNode
    actionButtonText: string
    actionButtonEnabled?: boolean
    actionButtonClass?: string

    formIsValid: boolean
    onShowValidationChange(showValidation: boolean): void

    onSuccess(payload: any): Promise<void>
    onClose(): void
    onSubmit(
        data: any
    ): Promise<
        | {
              shouldClose?: boolean
              responseData: any
          }
        | undefined
        | void
    >
    onCancel?(): void

    closeRef?: React.MutableRefObject<() => void>
    modalClass?: string
    focusFirst?: boolean
    showFooter?: boolean
}

// Dialog component that takes out some of the boilerplate required for forms. If you have a more
// complex scenario, you probably shouldn't use this component.
export function EasyFormDialog(props: PropsWithChildren<EasyFormDialogProps>) {
    const {
        title,
        actionButtonText,
        actionButtonEnabled,
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
        children
    } = defaults(props, { actionButtonEnabled: true })
    const onError = useContext(ItiReactContext).easyFormDialog.onError

    const [submitting, setSubmitting] = useState(false)

    const _closeRef = useRef(() => {
        /* no-op */
    })
    const closeRef = props.closeRef ? props.closeRef : _closeRef

    const formRef = useRef<HTMLFormElement | null>(null)

    // There are two ways to access the values of the form fields in the submit function
    //
    // 1. (Recommended) Use controlled components. Store the form field values in the
    //    component's state.
    //
    // 2. Use uncontrolled components. EasyFormDialog will pass a `formData` object to
    //    `onSubmit` that contains key-value pairs for each form field
    async function submit() {
        onShowValidationChange(true)

        if (!formIsValid) return false

        setSubmitting(true)

        let shouldClose
        let responseData

        if (!formRef.current) throw new Error('formRef.current is null.')
        const formData = formToObject($<HTMLElement>(formRef.current))

        try {
            const onSubmitReturnValue = await onSubmit(formData)

            if (onSubmitReturnValue) {
                shouldClose = onSubmitReturnValue.shouldClose
                responseData = onSubmitReturnValue.responseData
            }

            if (typeof shouldClose === 'undefined') shouldClose = true
        } catch (e) {
            onError(e)
            return
        }

        if (shouldClose) {
            try {
                // onSuccess may be loading data, so wait for it to finish before hiding the modal
                // and setting loading=false
                await onSuccess(responseData)
                closeRef.current()
            } catch {
                // not responsible for calling onError
                return
            }
        }

        setSubmitting(false)
    }

    // Submit form on Ctrl+Enter - convenient when you are typing in a textarea
    // TODO:UI remove type assertions when sam's PR accepted
    useEventListener('keypress', (e: any) => {
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
                ref={formRef}
                onSubmit={e => {
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
