import React, { useContext, useState, PropsWithChildren, useRef, useEffect } from 'react'
import {
    getSubmitEnabled,
    ItiReactCoreContext,
    useCancellablePromiseCleanup,
} from '@interface-technologies/iti-react-core'
import moment from 'moment-timezone'
import { pseudoCancellable } from 'real-cancellable-promise'
import { EasyFormDialogOnSubmitReturn } from './dialog'
import { useCtrlEnterListener } from '../hooks'
import { SubmitButton } from './SubmitButton'
import { focusFirstInput } from '../util'

/** The props type of [[`EasyFormPopover`]]. */
export interface EasyFormPopoverProps {
    /** The text of the submit button. */
    submitButtonText: string

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
     */
    onSubmit(): Promise<EasyFormDialogOnSubmitReturn<unknown>> | Promise<void>

    onClose(): void

    /**
     * Set to `false` to disable the default behavior of focusing the first
     * input.
     */
    focusFirst?: boolean
}

/**
 * Like [[`EasyFormDialog`]], but a popover. For small forms.
 *
 * There must be an empty `div` in the document with ID `easyFormPopoverPortalDestination`.
 */
export function EasyFormPopover({
    submitButtonText,
    submitEnabled: propsSubmitEnabled = true,
    formIsValid,
    showValidation,
    onShowValidationChange,
    onSuccess,
    focusFirst,
    onSubmit,
    onClose,
    children,
}: PropsWithChildren<EasyFormPopoverProps>): React.ReactElement {
    const submitEnabled =
        propsSubmitEnabled && getSubmitEnabled(formIsValid, showValidation)

    const capture = useCancellablePromiseCleanup()
    const { onError } = useContext(ItiReactCoreContext)

    const formRef = useRef<HTMLElement>(null)

    useEffect(() => {
        if (focusFirst) {
            // delay it a bit so that popper.js has time to position the popover
            window.setTimeout(() => {
                if (!formRef.current)
                    throw new Error('formRef.current is unexpectedly null.')
                focusFirstInput(formRef.current)
            }, 100)
        }
    }, [focusFirst])

    const [submitting, setSubmitting] = useState(false)
    const submittedTimeRef = useRef<moment.Moment>()

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

        try {
            // hack to allow onSubmit to return void
            const onSubmitReturnValue =
                (await onSubmit()) as EasyFormDialogOnSubmitReturn<unknown>

            const shouldClose = onSubmitReturnValue?.shouldClose ?? true
            const responseData = onSubmitReturnValue?.responseData

            if (shouldClose) {
                // onSuccess may be loading data, so wait for it to finish before hiding the popover
                // and setting submitting=false
                const promise = onSuccess(responseData)

                try {
                    // To prevent setState after unmount when onSuccess causes the popover to unmount
                    await capture(pseudoCancellable(promise))
                    setSubmitting(false)
                    onClose()
                } catch (e) {
                    // popover unmounted - do nothing
                }
            } else {
                setSubmitting(false)
            }
        } catch (e) {
            onError(e)
        }
    }

    useCtrlEnterListener(submit, submitEnabled)

    const [portalDestination] = useState(() =>
        document.getElementById('easyFormPopoverPortalDestination')
    )
    if (!portalDestination)
        throw new Error('Could not find easyFormPopoverPortalDestination.')

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                void submit()
            }}
            noValidate
        >
            <div className="form-contents">{children}</div>
            <SubmitButton
                submitting={submitting}
                enabled={submitEnabled}
                className="btn btn-primary btn-sm"
                data-testid="submit-button"
            >
                {submitButtonText}
            </SubmitButton>
        </form>
    )
}
