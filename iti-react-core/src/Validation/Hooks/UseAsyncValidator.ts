import { useState, useEffect } from 'react'
import { isEqual } from 'lodash'
import { useDebouncedCallback } from 'use-debounce'
import { ValidatorOutput, AsyncValidator } from '../Validator'
import { useQuery, usePrevious } from '../../Hooks'
import { CancellablePromise } from '../../CancellablePromise'

export type UseAsyncValidator = <TValue>(options: {
    value: TValue
    validationKey: string | number | undefined
    synchronousValidatorsValid: boolean

    asyncValidator: AsyncValidator<TValue> | undefined
    onError(e: unknown): void
}) => {
    asyncValidatorOutput: ValidatorOutput
    asyncValidationInProgress: boolean
}

// Not for use outside of iti-react
export const useAsyncValidator: UseAsyncValidator = options => {
    const {
        value,
        validationKey,
        synchronousValidatorsValid,
        asyncValidator,
        onError
    } = options

    const [asyncValidationInProgress, setAsyncValidationInProgress] = useState(false)

    const pendingValidatorOutput: ValidatorOutput = {
        valid: false,
        invalidFeedback: undefined
    }

    const defaultValidatorOutput = asyncValidator
        ? pendingValidatorOutput
        : { valid: true, invalidFeedback: undefined }

    const [asyncValidatorOutput, setAsyncValidatorOutput] = useState<ValidatorOutput>(
        defaultValidatorOutput
    )

    const { doQuery } = useQuery<ValidatorOutput>({
        query: () => {
            if (!asyncValidator) {
                return CancellablePromise.resolve({
                    valid: true,
                    invalidFeedback: undefined
                })
            }

            if (!synchronousValidatorsValid) {
                return CancellablePromise.resolve({
                    valid: false,
                    invalidFeedback: undefined
                })
            }

            return asyncValidator(value)
        },
        onResultReceived: setAsyncValidatorOutput,
        onLoadingChange: setAsyncValidationInProgress,
        queryOnMount: !!asyncValidator,
        onError
    })

    const [doQueryDebounced] = useDebouncedCallback(doQuery, 400)

    const prevValue = usePrevious(value)
    const prevValidationKey = usePrevious(validationKey)

    useEffect(() => {
        if (asyncValidator) {
            if (!isEqual(prevValue, value) || prevValidationKey !== validationKey) {
                setAsyncValidatorOutput(pendingValidatorOutput)
                doQueryDebounced()
            }
        } else {
            if (!asyncValidatorOutput.valid) {
                setAsyncValidatorOutput({ valid: true, invalidFeedback: undefined })
            }
        }
    })

    return { asyncValidatorOutput, asyncValidationInProgress }
}
