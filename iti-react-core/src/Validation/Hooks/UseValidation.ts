import React, { useEffect, useMemo, useRef } from 'react'
import { noop } from 'lodash'
import {
    Validator,
    getCombinedValidatorOutput,
    ValidatorOutput,
    combineValidatorOutput,
    AsyncValidator,
} from '../Validator'
import { useAsyncValidator } from './UseAsyncValidator'

interface UseValidationPropOptions<TValue> {
    name: string
    onValidChange?(name: string, valid: boolean): void

    validators: Validator<TValue>[]

    validationKey?: string | number | boolean

    asyncValidator?: AsyncValidator<TValue>
    onAsyncValidationInProgressChange?(name: string, inProgress: boolean): void

    /** defaults to onError from ItiReactCoreContext */
    onAsyncError?(e: unknown): void

    formLevelValidatorOutput?: ValidatorOutput
}

/**
 * Input components that call [[`useValidation`]] should generally have their
 * Props interface extend this.
 */
export interface UseValidationProps<TValue> extends UseValidationPropOptions<TValue> {
    value?: TValue
    defaultValue?: TValue
    onChange?(value: TValue): void

    showValidation: boolean
}

export interface UseValidationOptions<TValue> extends UseValidationPropOptions<TValue> {
    value: TValue
}

export interface UseValidationOutput {
    valid: boolean
    invalidFeedback: React.ReactNode

    asyncValidationInProgress: boolean
}

/**
 * A hook that allows implementing validation in any input component.
 *
 * Internally, `useValidation` calls `useMemo` on `validators` and `asyncValidator`
 * since those props won't have stable identities if defined during the render
 * as is typical. If `useValidation` did not do this, every component that rendered
 * a validated component would have to call `useMemo` on `validators` and
 * `asyncValidator` (or move the definitions outside of the component) to prevent
 * infinite `useEffect` loops.
 *
 * If and when your `validators` or `asyncValidator` do change, you **must** pass a
 * different `validationKey` for `useValidation` to pick up the changes.
 *
 * @typeParam TValue the type of the input's value
 */
export function useValidation<TValue>({
    value,
    name,
    validationKey,
    onAsyncError,
    formLevelValidatorOutput,
    ...otherProps
}: UseValidationOptions<TValue>): UseValidationOutput {
    /* eslint-disable react-hooks/exhaustive-deps */
    const validators = useMemo(() => otherProps.validators, [validationKey])
    const asyncValidator = useMemo(() => otherProps.asyncValidator, [validationKey])
    /* eslint-enable react-hooks/exhaustive-deps */

    const synchronousValidatorOutput = getCombinedValidatorOutput(value, validators)

    const { asyncValidatorOutput, asyncValidationInProgress } = useAsyncValidator({
        value,
        synchronousValidatorsValid: synchronousValidatorOutput.valid,
        asyncValidator,
        onError: onAsyncError,
    })

    const onValidChangeRef = useRef(otherProps.onValidChange ?? noop)
    const onAsyncValidationInProgressChangeRef = useRef(
        otherProps.onAsyncValidationInProgressChange ?? noop
    )
    useEffect(() => {
        onValidChangeRef.current = otherProps.onValidChange ?? noop
        onAsyncValidationInProgressChangeRef.current =
            otherProps.onAsyncValidationInProgressChange ?? noop
    })

    const overallValid = synchronousValidatorOutput.valid && asyncValidatorOutput.valid

    useEffect(() => {
        onValidChangeRef.current(name, overallValid)
    }, [name, overallValid])

    useEffect(() => {
        onAsyncValidationInProgressChangeRef.current(name, asyncValidationInProgress)
    }, [name, asyncValidationInProgress])

    const validatorOutputs = [synchronousValidatorOutput, asyncValidatorOutput]
    if (formLevelValidatorOutput) validatorOutputs.push(formLevelValidatorOutput)

    const combinedOutput = combineValidatorOutput(validatorOutputs)

    return {
        valid: combinedOutput.valid,
        invalidFeedback: combinedOutput.invalidFeedback,
        asyncValidationInProgress,
    }
}
