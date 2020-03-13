﻿import React, { useEffect, useMemo, useRef } from 'react'
import { noop } from 'lodash'
import {
    Validator,
    getCombinedValidatorOutput,
    ValidatorOutput,
    combineValidatorOutput,
    AsyncValidator
} from '../Validator'
import { useAsyncValidator } from './UseAsyncValidator'

interface UseValidationPropOptions<TValue> {
    name: string
    onValidChange?(name: string, valid: boolean): void

    validators: Validator<TValue>[]

    // Internally, `useValidation` calls `useMemo` on `validators` and `asyncValidator`
    // since those props won't have stable identities if defined during the render
    // as is typical. If `useValidation` did not do this, every component that rendered
    // a validated component would have to call `useMemo` on `validators` and
    // `asyncValidator` (or move the definitions outside of the component) to prevent
    // infinite `useEffect` loops.
    //
    // If and when you `validators` or `asyncValidator` do change, you MUST pass a different
    // `validationKey` for `useValidation` to pick up the changes.
    validationKey?: string | number

    asyncValidator?: AsyncValidator<TValue>
    onAsyncError?(e: unknown): void
    onAsyncValidationInProgressChange?(name: string, inProgress: boolean): void

    formLevelValidatorOutput?: ValidatorOutput
}

// Input components that call useValidation should generally have their Props interface
// extend this
export interface UseValidationProps<TValue> extends UseValidationPropOptions<TValue> {
    value?: TValue
    defaultValue?: TValue
    onChange?(value: TValue): void

    showValidation: boolean
}

interface UseValidationOptions<TValue> extends UseValidationPropOptions<TValue> {
    value: TValue
}

export interface UseValidationOutput {
    valid: boolean
    invalidFeedback: React.ReactNode

    asyncValidationInProgress: boolean
}

export function useValidation<TValue>({
    value,
    name,
    validationKey,
    onAsyncError = noop,
    formLevelValidatorOutput,
    ...otherProps
}: UseValidationOptions<TValue>): UseValidationOutput {
    const validatorsRef = useRef(otherProps.validators)
    const asyncValidatorRef = useRef(otherProps.asyncValidator)

    useEffect(() => {
        validatorsRef.current = otherProps.validators
        asyncValidatorRef.current = otherProps.asyncValidator
    })

    /* eslnt-disable react-hooks/exhaustive-deps */
    const validators = useMemo(() => validatorsRef.current, [validationKey])
    const asyncValidator = useMemo(() => asyncValidatorRef.current, [validationKey])
    /* eslint-enable react-hooks/exhaustive-deps */

    const synchronousValidatorOutput = getCombinedValidatorOutput(value, validators)

    const { asyncValidatorOutput, asyncValidationInProgress } = useAsyncValidator({
        value,
        synchronousValidatorsValid: synchronousValidatorOutput.valid,
        asyncValidator,
        onError: onAsyncError
    })

    const onValidChangeRef = useRef(otherProps.onValidChange ?? noop)
    useEffect(() => {
        onValidChangeRef.current = otherProps.onValidChange ?? noop
    })

    const overallValid = synchronousValidatorOutput.valid && asyncValidatorOutput.valid

    useEffect(() => {
        onValidChangeRef.current(name, overallValid)
    }, [name, overallValid])

    const onAsyncValidationInProgressChangeRef = useRef(
        otherProps.onAsyncValidationInProgressChange ?? noop
    )
    useEffect(() => {
        onAsyncValidationInProgressChangeRef.current =
            otherProps.onAsyncValidationInProgressChange ?? noop
    })

    useEffect(() => {
        onAsyncValidationInProgressChangeRef.current(name, asyncValidationInProgress)
    }, [name, asyncValidationInProgress])

    const validatorOutputs = [synchronousValidatorOutput, asyncValidatorOutput]
    if (formLevelValidatorOutput) validatorOutputs.push(formLevelValidatorOutput)

    const combinedOutput = combineValidatorOutput(validatorOutputs)

    return {
        valid: combinedOutput.valid,
        invalidFeedback: combinedOutput.invalidFeedback,
        asyncValidationInProgress
    }
}
