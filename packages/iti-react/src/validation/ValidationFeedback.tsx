import React, { PropsWithChildren, useContext, useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import {
    ASYNC_VALIDATION_PENDING,
    ASYNC_VALIDATION_DEBOUNCE_PENDING,
    INVALID_NO_FEEDBACK,
    ValidatorOutput,
} from '@interface-technologies/iti-react-core'
import { ItiReactContext } from '../ItiReactContext'

/**
 * Used to show a loading indicator when async validation is progress. Uses debouncing
 * so the loading indicator is never displayed if the async validation completes quickly.
 */
export function useDebouncedAsyncValidationPending(propsPending: boolean): boolean {
    const [pending, setPending] = useState(false)

    const setPendingDebounced = useDebouncedCallback(setPending, 1000)

    useEffect(() => {
        if (propsPending) {
            setPendingDebounced(true)
        } else {
            setPendingDebounced.cancel()
            setPending(false)
        }
    }, [propsPending, setPendingDebounced])

    return pending
}

export type ValidationFeedbackProps = PropsWithChildren<{
    validatorOutput: ValidatorOutput
    showValidation: boolean

    renderLoadingIndicator?: () => React.ReactNode
    className?: string
}>

/**
 * Displays validation feedback below an input. Used by `ValidatedInput`, .etc.
 *
 * You usually won't use this directly unless creating your own input component.
 */
export function ValidationFeedback({
    validatorOutput,
    showValidation,
    children,
    renderLoadingIndicator,
    className,
}: ValidationFeedbackProps): JSX.Element {
    const contextRenderLoadingIndicator =
        useContext(ItiReactContext).renderLoadingIndicator
    renderLoadingIndicator = renderLoadingIndicator ?? contextRenderLoadingIndicator

    const debouncedAsyncValidationPending = useDebouncedAsyncValidationPending(
        validatorOutput === ASYNC_VALIDATION_PENDING
    )

    let feedback: React.ReactNode

    if (showValidation) {
        if (validatorOutput === ASYNC_VALIDATION_PENDING) {
            if (debouncedAsyncValidationPending) {
                feedback = (
                    <div className="pending-feedback">
                        {renderLoadingIndicator()} Validating...
                    </div>
                )
            }
        } else if (
            validatorOutput &&
            validatorOutput !== INVALID_NO_FEEDBACK &&
            validatorOutput !== ASYNC_VALIDATION_DEBOUNCE_PENDING
        ) {
            feedback = <div className="invalid-feedback">{validatorOutput}</div>
        }
    }

    const classes = ['validated-input']
    if (className) classes.push(className)

    return (
        <div className={classes.join(' ')}>
            {children}
            {feedback}
        </div>
    )
}

/**
 * Returns a Bootstrap validation class depending on `valid` and `showValidation`.
 */
export function getValidationClass(valid: boolean, showValidation: boolean): string {
    if (showValidation) {
        if (valid) return 'is-valid'
        return 'is-invalid'
    }

    return ''
}
