import React, { useContext, useState, PropsWithChildren, useRef } from 'react'
import useEventListener from '@use-it/event-listener'
import { noop } from 'lodash'
import { ItiReactCoreContext } from '@interface-technologies/iti-react-core'
import moment from 'moment-timezone'
import { ActionDialog } from './Dialog'

/** @deprecated */
export type EasyFormDialogFormData = { [name: string]: string | boolean }

/* eslint-disable */
function formToObject(form: any): EasyFormDialogFormData {
    const array = form.serializeArray()
    const obj: EasyFormDialogFormData = {}

    for (const pair of array) {
        obj[pair.name] = pair.value
    }

    // serializeArray() ignores checkbox if it's unchecked and puts its value as "on"
    // if it is checked. This doesn't play well with web API so here we turn the
    // checkboxes into booleans.
    const checkboxes = form.find('[type="checkbox"]').toArray()

    for (const checkboxEl of checkboxes) {
        const checkbox = $(checkboxEl)
        const name = checkbox.attr('name')

        if (name) {
            obj[name] = checkbox.is(':checked')
        }
    }

    return obj
}
/* eslint-enable */

export type EasyFormDialogOnSubmitReturn<TResponseData> =
    | {
          shouldClose?: boolean
          responseData: TResponseData
      }
    | undefined

export interface EasyFormDialogProps<TResponseData> {
    title: React.ReactNode
    actionButtonText: string
    actionButtonEnabled?: boolean
    actionButtonClass?: string
    cancelButtonText?: string

    formIsValid: boolean
    onShowValidationChange(showValidation: boolean): void

    onSuccess(payload: TResponseData | undefined): Promise<void>
    onClose(): void

    /**
     * Using `formData` is deprecated. Use controlled components instead.
     *
     * `formData` will be `{}` if the optional peer dependency `jQuery` is
     * not installed.
     */
    onSubmit(
        formData: EasyFormDialogFormData
    ): Promise<EasyFormDialogOnSubmitReturn<TResponseData>> | Promise<void>
    onCancel?(): void

    closeRef?: React.MutableRefObject<() => void>
    modalClass?: string
    focusFirst?: boolean
    showFooter?: boolean
}

/**
 * Component factory that returns an [[`EasyFormDialog`]] and allows you to specify the
 * `TResponseData` type parameter. I am not aware of any case where this is necessary
 * for the types to work out.
 */
export function getGenericEasyFormDialog<TResponseData>() {
    // Dialog component that takes out some of the boilerplate required for forms
    return function EasyFormDialog({
        title,
        actionButtonText,
        actionButtonEnabled = true,
        actionButtonClass,
        cancelButtonText,
        formIsValid,
        onShowValidationChange,
        onSuccess,
        modalClass,
        focusFirst,
        onClose,
        onSubmit,
        onCancel,
        showFooter,
        children,
        closeRef = {
            current: noop,
        },
    }: PropsWithChildren<EasyFormDialogProps<TResponseData>>): React.ReactElement {
        const { onError } = useContext(ItiReactCoreContext)

        const [submitting, setSubmitting] = useState(false)
        const submittedTimeRef = useRef<moment.Moment>()

        const formRef = useRef<HTMLFormElement | null>(null)

        async function submit(): Promise<void> {
            onShowValidationChange(true)
            if (!formIsValid) return

            // Prevent double submit when Ctrl+Enter is pressed in Firefox
            if (
                submittedTimeRef.current &&
                moment().diff(submittedTimeRef.current, 'ms') < 200
            ) {
                return
            }

            submittedTimeRef.current = moment()

            setSubmitting(true)

            let formData: EasyFormDialogFormData = {}

            // jQuery is an optional peer dependency.
            // We have to be careful not to depend on @types/jquery either.
            /* eslint-disable */
            const jq = (window as any).jQuery

            if (typeof jq !== 'undefined') {
                if (!formRef.current) throw new Error('formRef.current is null.')
                formData = formToObject(jq(formRef.current))
            }
            /* eslint-enable */

            try {
                // hack to allow onSubmit to return void
                const onSubmitReturnValue = (await onSubmit(
                    formData
                )) as EasyFormDialogOnSubmitReturn<TResponseData>

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
        useEventListener('keypress', (e: KeyboardEvent) => {
            if (e.ctrlKey && e.code === 'Enter') {
                void submit()
            }
        })

        return (
            <ActionDialog
                closeRef={closeRef}
                title={title}
                actionButtonText={actionButtonText}
                actionButtonEnabled={actionButtonEnabled}
                actionButtonClass={actionButtonClass}
                cancelButtonText={cancelButtonText}
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
                    onSubmit={async (e) => {
                        e.preventDefault()
                        await submit()
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

/**
 *
 */
export const EasyFormDialog = getGenericEasyFormDialog<unknown>()
