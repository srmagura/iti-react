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

export interface EasyFormDialogProps {
    title: React.ReactNode

    submitButtonText: string
    submitButtonClass?: string
    cancelButtonText?: string

    submitEnabled?: boolean

    formIsValid: boolean
    onShowValidationChange(showValidation: boolean): void

    /**
     * If async validation is in progress, the action button should be disabled.
     * Use this prop to tell `EasyFormDialog` that we're waiting on validation
     * to complete. Use this with [[`useValidationProgress`]].
     */
    validationInProgress?: boolean

    onSuccess(payload: unknown | undefined): Promise<void>
    onClose(): void

    /**
     * Using `formData` is deprecated. Use controlled components instead.
     *
     * `formData` will be `{}` if the optional peer dependency `jQuery` is
     * not installed.
     */
    onSubmit(
        formData: EasyFormDialogFormData
    ): Promise<EasyFormDialogOnSubmitReturn<unknown>> | Promise<void>
    onCancel?(): void

    closeRef?: React.MutableRefObject<() => void>
    modalClass?: string
    focusFirst?: boolean
    showFooter?: boolean
}

/**
 * A wrapper around [[`ActionDialog`]] that removes a lot of the boilerplate needed
 * for dialogs that contain a form.
 *
 * ```
 * interface ExampleProps {
 *     onSuccess(responseData: number): Promise<void>
 *     onClose(): void
 * }
 *
 * export function Example({
 *     onSuccess,
 *     onClose,
 * }: ExampleProps): ReactElement {
 *     const { onChildValidChange, allFieldsValid } = useFieldValidity()
 *     const [showValidation, setShowValidation] = useState(false)
 *     const vProps = { showValidation, onValidChange: onChildValidChange }
 *
 *     const [myNumber, setMyNumber] = useState('')
 *
 *     async function submit() {
 *         await api.product.performOperation()
 *
 *         return {
 *             responseData: parseInt(myNumber),
 *         }
 *     }
 *
 *     return (
 *         <EasyFormDialog
 *             title="Enter a Number"
 *             submitButtonText="Submit"
 *             formIsValid={allFieldsValid}
 *             onShowValidationChange={setShowValidation}
 *             onSubmit={submit}
 *             onSuccess={onSuccess}
 *             onClose={onClose}
 *         >
 *             <FormGroup label="My number">
 *                 {(id) => (
 *                     <ValidatedInput
 *                         id={id}
 *                         name="myNumber"
 *                         validators={[Validators.required(), Validators.integer()]}
 *                         value={myNumber}
 *                         onChange={setMyNumber}
 *                         {...vProps}
 *                     />
 *                 )}
 *             </FormGroup>
 *         </EasyFormDialog>
 *     )
 * }
 * ```
 */
export function EasyFormDialog({
    title,
    submitButtonText,
    submitEnabled = true,
    submitButtonClass,
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
    validationInProgress,
}: PropsWithChildren<EasyFormDialogProps>): React.ReactElement {
    if (validationInProgress) submitEnabled = false

    const { onError } = useContext(ItiReactCoreContext)

    const [submitting, setSubmitting] = useState(false)
    const submittedTimeRef = useRef<moment.Moment>()

    const formRef = useRef<HTMLFormElement | null>(null)

    async function submit(): Promise<void> {
        if (!submitEnabled) return

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

        if (jq) {
            if (!formRef.current) throw new Error('formRef.current is null.')
            formData = formToObject(jq(formRef.current))
        }
        /* eslint-enable */

        try {
            // hack to allow onSubmit to return void
            const onSubmitReturnValue = (await onSubmit(
                formData
            )) as EasyFormDialogOnSubmitReturn<unknown>

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
            actionButtonText={submitButtonText}
            actionButtonEnabled={submitEnabled}
            actionButtonClass={submitButtonClass}
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
                <input type="submit" hidden />
            </form>
        </ActionDialog>
    )
}
