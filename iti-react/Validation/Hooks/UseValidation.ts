import * as React from 'react'
import { useEffect } from 'react'
import { Validator, getCombinedValidatorOutput, ValidatorOutput } from '../ValidatorCore'
import { AsyncValidator } from '../AsyncValidator'
import { isEqual, defaults } from 'lodash'
import { useAsyncValidator } from './UseAsyncValidator'
import { usePrevious } from '../../Hooks'

interface CommonOptions<TValue> {
    name: string
    showValidation: boolean
    onValidChange?(name: string, valid: boolean): void

    validators: Validator<TValue>[]

    // If you change the validators or asyncValidator, you must also change the validationKey.
    // Otherwise, WithValidation has no way to know the validators have changed.
    validationKey?: string | number

    asyncValidator?: AsyncValidator<TValue>
    onAsyncError?(e: any): void
    onAsyncValidationInProgressChange?(name: string, inProgress: boolean): void

    formLevelValidatorOutput?: ValidatorOutput
}

// Input components that call useValidation should generally have their Props interface
// extend this interface
export interface UseValidationProps<TValue> extends CommonOptions<TValue> {
    value?: TValue
    defaultValue?: TValue
    onChange?(value: TValue): void
}

interface UseValidationOptions<TValue> extends CommonOptions<TValue> {
    value: TValue
}

export interface UseValidationOutput {
    name: string

    valid: boolean
    showValidation: boolean
    invalidFeedback: React.ReactNode

    asyncValidationInProgress: boolean
}

export function useValidation<TValue>(
    options: UseValidationOptions<TValue>
): UseValidationOutput {
    const {
        value,
        name,
        showValidation,
        onValidChange,
        validators,
        validationKey,
        asyncValidator,
        onAsyncError,
        onAsyncValidationInProgressChange,
        formLevelValidatorOutput
    } = defaults(
        { ...options },
        {
            onValidChange: () => {},
            onAsyncError: () => {},
            onAsyncValidationInProgressChange: () => {}
        }
    )

    const { asyncValidationInProgress } = useAsyncValidator()

    const prevValue = usePrevious(value)
    const prevValidationKey = usePrevious(validationKey)

    useEffect(() => {
        if (!isEqual(prevValue, value) || prevValidationKey !== validationKey) {
            let valid = getCombinedValidatorOutput(value, validators).valid
            //if (valid && this.asyncValidatorRunner) {
            //    this.asyncValidatorRunner.handleInputChange(value)
            //    valid = false
            //}

            onValidChange(name, valid)
        }
    })

    const combinedOutput = getCombinedValidatorOutput(value, validators)
    const synchronousValidatorsValid = combinedOutput.valid

    let valid = synchronousValidatorsValid
    let invalidFeedback

    if (formLevelValidatorOutput && !formLevelValidatorOutput.valid)
        invalidFeedback = formLevelValidatorOutput.invalidFeedback

    if (!combinedOutput.valid) invalidFeedback = combinedOutput.invalidFeedback

    //if (asyncValidator) {
    //    if (asyncValidatorOutput) {
    //        valid = valid && asyncValidatorOutput.valid

    //        if (synchronousValidatorsValid) {
    //            invalidFeedback = asyncValidatorOutput.invalidFeedback
    //        }
    //    } else {
    //        if (synchronousValidatorsValid) {
    //            // Waiting for async validation to finish
    //            valid = false
    //            invalidFeedback = undefined
    //        }
    //    }
    //}

    return {
        name,
        valid,
        invalidFeedback: invalidFeedback,
        showValidation,
        asyncValidationInProgress
    }
}
