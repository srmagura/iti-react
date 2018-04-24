import * as React from 'react';

export interface IValidatorOutput {
    valid: boolean
    invalidFeedback: React.ReactNode
}

export type Validator = (value: string) => IValidatorOutput

export function getCombinedValidatorOutput(value: string, validators: Validator[]) {
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