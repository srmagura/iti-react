import * as React from 'react'

export interface ValidatorOutput {
    valid: boolean
    invalidFeedback: React.ReactNode
}

export type Validator<TValue> = (value: TValue) => ValidatorOutput

export function getCombinedValidatorOutput<TValue>(
    value: TValue,
    validators: Validator<TValue>[]
) {
    for (const validator of validators) {
        const currentOutput = validator(value)

        if (!currentOutput.valid) {
            return currentOutput
        }
    }

    return {
        valid: true,
        invalidFeedback: undefined
    }
}
