﻿import * as React from 'react'
import { useEffect } from 'react'
import {
    Validator,
    getCombinedValidatorOutput,
    ValidatorOutput,
    AsyncValidator,
    combineValidatorOutput
} from '../ValidatorCore'
import { defaults } from 'lodash'
import { useAsyncValidator } from './UseAsyncValidator'

interface CommonOptions<TValue> {
    name: string
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
// extend this
export interface UseValidationProps<TValue> extends CommonOptions<TValue> {
    value?: TValue
    defaultValue?: TValue
    onChange?(value: TValue): void

    showValidation: boolean
}

interface UseValidationOptions<TValue> extends CommonOptions<TValue> {
    value: TValue
}

export interface UseValidationOutput {
    valid: boolean
    invalidFeedback: React.ReactNode

    asyncValidationInProgress: boolean
}

export function useValidation<TValue>(
    options: UseValidationOptions<TValue>
): UseValidationOutput {
    const {
        value,
        name,
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

    const synchronousValidatorOutput = getCombinedValidatorOutput(value, validators)

    const { asyncValidatorOutput, asyncValidationInProgress } = useAsyncValidator({
        value,
        validationKey,
        synchronousValidatorsValid: synchronousValidatorOutput.valid,
        asyncValidator,
        onError: onAsyncError
    })

    useEffect(() => {
        onValidChange(
            name,
            synchronousValidatorOutput.valid && asyncValidatorOutput.valid
        )
    }, [
        onValidChange,
        name,
        synchronousValidatorOutput.valid,
        asyncValidatorOutput.valid
    ])

    useEffect(() => {
        onAsyncValidationInProgressChange(name, asyncValidationInProgress)
    }, [onAsyncValidationInProgressChange, name, asyncValidationInProgress])

    const validatorOutputs = [synchronousValidatorOutput, asyncValidatorOutput]
    if (formLevelValidatorOutput) validatorOutputs.push(formLevelValidatorOutput)

    const combinedOutput = combineValidatorOutput(validatorOutputs)

    return {
        valid: combinedOutput.valid,
        invalidFeedback: combinedOutput.invalidFeedback,
        asyncValidationInProgress
    }
}
