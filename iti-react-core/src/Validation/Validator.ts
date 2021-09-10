import React from 'react'
import { CancellablePromise } from '../CancellablePromise'

export interface ValidatorOutput {
    valid: boolean
    invalidFeedback: React.ReactNode
}

/** The "contract" that all validators must implement. */
export type Validator<TValue> = (value: TValue) => ValidatorOutput

/** The "contract" that all async validators msut implement. */
export type AsyncValidator<TValue> = (
    input: TValue
) => CancellablePromise<ValidatorOutput>

/**
 * Takes in multiple `ValidatorOutput`'s and returns the first invalid one, or
 * `{ valid: true, invalidFeedback: undefined }` if all are valid.
 */
export function combineValidatorOutput(outputs: ValidatorOutput[]): ValidatorOutput {
    for (const output of outputs) {
        if (!output.valid) {
            return output
        }
    }

    return { valid: true, invalidFeedback: undefined }
}

/**
 * Applies multiple validators to a value and returns the combined result. Thin wrapper
 * around [[`combineValidatorOutput`]].
 */
export function getCombinedValidatorOutput<TValue>(
    value: TValue,
    validators: Validator<TValue>[]
): ValidatorOutput {
    return combineValidatorOutput(validators.map((v) => v(value)))
}
