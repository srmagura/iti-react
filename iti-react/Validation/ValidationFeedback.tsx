import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { ItiReactContext } from '../ItiReactContext'
import { defaults } from 'lodash'
import { useDebouncedCallback } from 'use-debounce'

export interface ValidationFeedbackProps {
    valid: boolean
    showValidation: boolean
    invalidFeedback: React.ReactNode

    asyncValidationInProgress?: boolean
    renderLoadingIndicator?: () => React.ReactNode
    children?: React.ReactNode
}

export function ValidationFeedback(props: ValidationFeedbackProps) {
    const {
        valid,
        showValidation,
        children,
        invalidFeedback,
        asyncValidationInProgress: propsAsyncValidationInProgress,
        renderLoadingIndicator
    } = defaults(
        { ...props },
        {
            asyncValidationInProgress: false,
            renderLoadingIndicator: useContext(ItiReactContext).renderLoadingIndicator
        }
    )

    const asyncValidationInProgress = useDebouncedAsyncValidationInProgress(
        propsAsyncValidationInProgress
    )

    let feedback: React.ReactNode

    if (showValidation && asyncValidationInProgress) {
        feedback = (
            <div className="in-progress-feedback">
                {renderLoadingIndicator()} Validating...
            </div>
        )
    } else if (showValidation && !valid && invalidFeedback) {
        // invalid-feedback has a margin, so do not render it if invalidFeedback is empty
        feedback = <div className="invalid-feedback">{invalidFeedback}</div>
    }

    return (
        <div className="validated-input">
            {children}
            {feedback}
        </div>
    )
}

export function useDebouncedAsyncValidationInProgress(
    propsAsyncValidationInProgress: boolean
) {
    const [asyncValidationInProgress, setAsyncValidationInProgress] = useState(false)

    const [setToInProgress, cancel] = useDebouncedCallback(
        () => setAsyncValidationInProgress(true),
        1000
    )

    useEffect(() => {
        if (propsAsyncValidationInProgress) {
            setToInProgress()
        } else {
            cancel()
            setAsyncValidationInProgress(false)
        }
    }, [propsAsyncValidationInProgress])

    return asyncValidationInProgress
}

export function getValidationClass(valid: boolean, showValidation: boolean) {
    if (showValidation) {
        if (valid) return 'is-valid'
        else return 'is-invalid'
    }

    return ''
}
