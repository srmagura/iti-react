import React, { useContext, useState, PropsWithChildren, useRef } from 'react'
import useEventListener from '@use-it/event-listener'
import {
    getSubmitEnabled,
    ItiReactCoreContext,
} from '@interface-technologies/iti-react-core'
import moment from 'moment-timezone'
import { ActionDialog } from './Dialog'

/** @deprecated */
export type EasyFormDialogFormData = { [name: string]: string | boolean }

/* eslint-disable */
/** @deprecated */
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

/** The props type of [[`EasyFormDialog`]]. */
export interface EasyFormDialogProps {
    /** The title of the dialog. Can be a JSX element. */
    title: React.ReactNode

    /** The text of the submit button. */
    submitButtonText: string

    /** The CSS class of the submit button. */
    submitButtonClass?: string

    /** The text of the cancel button. Defaults to "Cancel". */
    cancelButtonText?: string

    /**
     * Allows you to disable the submit button even if `getSubmitEnabled()`
     * would return true.
     *
     * This can be useful if you want to disable the submit button while a query
     * is in progress.
     */
    submitEnabled?: boolean

    /** A boolean indicating if the form is valid. */
    formIsValid: boolean

    /** A boolean indicating if validation feedback is being shown. */
    showValidation: boolean

    /** A callback that fires when the dialog is submitted. */
    onShowValidationChange(showValidation: boolean): void

    /**
     * A callback that fires after the `submit` function succeeds.
     *
     * If the `submit` function returned `responseData`, it is passed to your
     * `onSuccess` function.
     *
     * Your `onSuccess` callback must return a promise. The submit button will
     * continue showing a loading indicator until the promise resolves. This is
     * to support refetching the data that was updated by the form submission.
     */
    onSuccess(payload: unknown | undefined): Promise<void>

    /**
     * A callback that fires when the dialog has completely closed. Your
     * `onClose` callback should update call, for example,
     * `setDialogVisible(false)` so that the `EasyFormDialog` is no longer
     * rendered.
     */
    onClose(): void

    /**
     * A callback that fires when the form is submitted. You will typically
     * perform an API call in your `submit` function.
     *
     * Your `submit` function can optionally return an object in the shape
     *
     * ```
     * {
     *     shouldClose?: boolean
     *     responseData: unknown
     * }
     * ```
     *
     * Using `formData` is deprecated. Use controlled components instead.
     *
     * `formData` will be `{}` if the optional peer dependency `jquery` is not
     * installed.
     */
    onSubmit(
        formData: EasyFormDialogFormData
    ): Promise<EasyFormDialogOnSubmitReturn<unknown>> | Promise<void>

    /**
     * An uncommonly-used callback that fires when the user clicks the cancel button.
     */
    onCancel?(): void

    /**
     * This prop accepts a ref object that holds a function of type `() =>
     * void`. You can execute the function to programmatically close the dialog:
     *
     * ```
     * closeRef.current()
     * ```
     */
    closeRef?: React.MutableRefObject<() => void>

    /** The CSS class added to the underlying Bootstrap modal. */
    modalClass?: string

    /**
     * Set to `false` to disable the default behavior of focusing the first
     * input.
     */
    focusFirst?: boolean

    /**
     * Set to `false` to hide the modal footer, which contains the submit and
     * cancel buttons.
     */
    showFooter?: boolean
}

/**
 * A wrapper around [[`ActionDialog`]] that removes a lot of the boilerplate needed
 * for dialogs that contain a form.
 *
 * ```tsx
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
 *             showValidation={showValidation}
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
    submitEnabled: propsSubmitEnabled = true,
    submitButtonClass,
    cancelButtonText,
    formIsValid,
    showValidation,
    onShowValidationChange,
    onSuccess,
    modalClass,
    focusFirst,
    onClose,
    onSubmit,
    onCancel,
    showFooter,
    children,
    closeRef: propsCloseRef,
}: PropsWithChildren<EasyFormDialogProps>): React.ReactElement {
    const internalCloseRef = useRef(() => {})
    const closeRef = propsCloseRef ?? internalCloseRef

    const submitEnabled =
        propsSubmitEnabled && getSubmitEnabled(formIsValid, showValidation)

    const { onError } = useContext(ItiReactCoreContext)

    const [submitting, setSubmitting] = useState(false)
    const submittedTimeRef = useRef<moment.Moment>()

    const formRef = useRef<HTMLFormElement | null>(null)

    async function submit(): Promise<void> {
        if (!submitEnabled) return
        if (submitting) return

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
