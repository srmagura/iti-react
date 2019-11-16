import React from 'react'
import { CancellablePromise } from '@interface-technologies/iti-react-core'

export interface ValidatorOutput {
    valid: boolean
    invalidFeedback: React.ReactNode
}

export type Validator<TValue> = (value: TValue) => ValidatorOutput

export type AsyncValidator<TInput> = (
    input: TInput
) => CancellablePromise<ValidatorOutput>

//
//
//

export function combineValidatorOutput(outputs: ValidatorOutput[]): ValidatorOutput {
    for (const output of outputs) {
        if (!output.valid) {
            return output
        }
    }

    return { valid: true, invalidFeedback: undefined }
}

export function getCombinedValidatorOutput<TValue>(
    value: TValue,
    validators: Validator<TValue>[]
) {
    return combineValidatorOutput(validators.map(v => v(value)))
}
