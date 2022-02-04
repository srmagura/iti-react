import React, {
    useContext,
    useState,
    PropsWithChildren,
    useRef,
    ReactElement,
    useEffect,
} from 'react'
import {
    getSubmitEnabled,
    ItiReactCoreContext,
    useCancellablePromiseCleanup,
} from '@interface-technologies/iti-react-core'
import moment from 'moment-timezone'
import { usePopper } from 'react-popper'
import { pseudoCancellable } from 'real-cancellable-promise'
import useEventListener from '@use-it/event-listener'
import ReactDOM from 'react-dom'
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

    /**
     * Set to `false` to disable the default behavior of focusing the first
     * input.
     */
    focusFirst?: boolean

    renderReferenceElement(args: {
        setRef(element: HTMLElement | null): void
        onClick(): void
    }): ReactElement
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
    children,
    renderReferenceElement,
}: PropsWithChildren<EasyFormPopoverProps>): React.ReactElement {
    const submitEnabled =
        propsSubmitEnabled && getSubmitEnabled(formIsValid, showValidation)

    const capture = useCancellablePromiseCleanup()
    const { onError } = useContext(ItiReactCoreContext)

    const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null)
    const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
    const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null)
    const [visible, setVisible] = useState(false)

    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
    })

    useEffect(() => {
        if (visible && focusFirst) {
            // delay it a bit so that popper.js has time to position the popover
            window.setTimeout(() => {
                if (!popperElement) throw new Error('popperElement is unexpectedly null.')
                focusFirstInput(popperElement)
            }, 100)
        }
    }, [visible, focusFirst, popperElement])

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
                    setVisible(false)
                    setSubmitting(false)
                } catch (e) {
                    // popover unmounted - do nothing
                }
            }
        } catch (e) {
            onError(e)
            return
        }

        setSubmitting(false)
    }

    useCtrlEnterListener(submit, submitEnabled)

    // Close popover on Escape
    useEventListener<'keydown'>('keydown', (e) => {
        if (visible && e.code === 'Escape') {
            setVisible(false)
        }
    })

    const [portalDestination] = useState(() =>
        document.getElementById('easyFormPopoverPortalDestination')
    )
    if (!portalDestination)
        throw new Error('Could not find easyFormPopoverPortalDestination.')

    const form = (
        <form
            onSubmit={async (e) => {
                e.preventDefault()
                await submit()
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

    return (
        <>
            {renderReferenceElement({
                setRef: setReferenceElement,
                onClick: () => setVisible(true),
            })}
            {visible &&
                ReactDOM.createPortal(
                    <div
                        ref={setPopperElement}
                        className="iti-react-popover"
                        style={styles.popper}
                        {...attributes.popper}
                    >
                        {form}
                        <div ref={setArrowElement} style={styles.arrow} />
                    </div>,
                    portalDestination
                )}
        </>
    )
}
