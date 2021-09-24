import React, { useContext, useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import {
    ASYNC_VALIDATION_PENDING,
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

export interface ValidationFeedbackProps {
    validatorOutput: ValidatorOutput
    showValidation: boolean

    renderLoadingIndicator?: () => React.ReactNode
    children?: React.ReactNode
}

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
        } else if (validatorOutput) {
            feedback = <div className="invalid-feedback">{validatorOutput}</div>
        }
    }

    return (
        <div className="validated-input">
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
