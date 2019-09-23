import { useState, useEffect } from 'react'
import { isEqual } from 'lodash'
import { useQuery } from '@interface-technologies/iti-react/Hooks'
import {
    ValidatorOutput,
    AsyncValidator
} from '@interface-technologies/iti-react/Validation/ValidatorCore'
import { CancellablePromise } from '@interface-technologies/iti-react-core'
import { usePrevious } from '@interface-technologies/iti-react/Hooks'
import { useDebouncedCallback } from 'use-debounce/lib'

// Not for use outside of iti-react
export function useAsyncValidator<TValue>(options: {
    value: TValue
    validationKey: string | number | undefined
    synchronousValidatorsValid: boolean

    asyncValidator: AsyncValidator<TValue> | undefined
    onError(e: any): void
}) {
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
        onError
    })

    const [doQueryDebounced] = useDebouncedCallback(doQuery, 400)

    const prevValue = usePrevious(value)
    const prevValidationKey = usePrevious(validationKey)

    useEffect(() => {
        if (!isEqual(prevValue, value) || prevValidationKey !== validationKey) {
            setAsyncValidatorOutput(pendingValidatorOutput)
            doQueryDebounced()
        }
    })

    return { asyncValidatorOutput, asyncValidationInProgress }
}
