import * as React from 'react'

export interface ValidationFeedbackProps {
    valid: boolean
    showValidation: boolean
    invalidFeedback: React.ReactNode

    asyncValidationInProgress: boolean
    renderLoadingIndicator?: () => React.ReactNode
    children?: React.ReactNode
}

export function ValidationFeedback(props: ValidationFeedbackProps) {
    const {
        valid,
        showValidation,
        children,
        invalidFeedback,
        asyncValidationInProgress,
        renderLoadingIndicator
    } = props

    let feedback: React.ReactNode

    if (showValidation && asyncValidationInProgress) {
        if (renderLoadingIndicator) {
            feedback = (
                <div className="in-progress-feedback">
                    {renderLoadingIndicator()} Validating...
                </div>
            )
        } else {
            feedback = <div className="in-progress-feedback">Validating...</div>
        }
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

ValidationFeedback.defaultProps = {
    asyncValidationInProgress: false
}

export function getValidationClass(valid: boolean, showValidation: boolean) {
    if (showValidation) {
        if (valid) return 'is-valid'
        else return 'is-invalid'
    }

    return ''
}
