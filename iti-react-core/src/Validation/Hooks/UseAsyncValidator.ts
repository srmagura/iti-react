import { useState } from 'react'
import { ValidatorOutput, AsyncValidator } from '../Validator'
import { useParameterizedQuery } from '../../Hooks'
import { CancellablePromise } from '../../CancellablePromise'

interface QueryParams<TValue> {
    asyncValidator: AsyncValidator<TValue> | undefined
    value: TValue
    synchronousValidatorsValid: boolean
}

interface UseAsyncValidatorOptions<TValue> {
    value: TValue
    synchronousValidatorsValid: boolean

    asyncValidator: AsyncValidator<TValue> | undefined
    onError(e: unknown): void
}

interface UseAsyncValidatorOutput {
    asyncValidatorOutput: ValidatorOutput
    asyncValidationInProgress: boolean
}

// Not for use outside of iti-react
export function useAsyncValidator<TValue>({
    value,
    synchronousValidatorsValid,
    onError,
    asyncValidator
}: UseAsyncValidatorOptions<TValue>): UseAsyncValidatorOutput {
    const [asyncValidationInProgress, setAsyncValidationInProgress] = useState(false)

    const [asyncValidatorOutput, setAsyncValidatorOutput] = useState<ValidatorOutput>(
        () => ({
            valid: !asyncValidator,
            invalidFeedback: undefined
        })
    )

    useParameterizedQuery<QueryParams<TValue>, ValidatorOutput>({
        queryParams: { asyncValidator, value, synchronousValidatorsValid },
        shouldQueryImmediately: (prev, cur) =>
            prev.asyncValidator !== cur.asyncValidator ||
            prev.synchronousValidatorsValid !== cur.synchronousValidatorsValid,
        query: (qp): CancellablePromise<ValidatorOutput> => {
            if (!qp.asyncValidator) {
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

            return qp.asyncValidator(qp.value)
        },
        onResultReceived: setAsyncValidatorOutput,
        onLoadingChange: setAsyncValidationInProgress,
        onError
    })

    return { asyncValidatorOutput, asyncValidationInProgress }
}
