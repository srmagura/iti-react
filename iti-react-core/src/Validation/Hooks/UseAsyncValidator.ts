import { useState, useMemo } from 'react'
import { ValidatorOutput, AsyncValidator } from '../Validator'
import { useParameterizedQuery } from '../../Hooks'
import { CancellablePromise } from '../../CancellablePromise'

interface QueryParams<TValue> {
    asyncValidator: AsyncValidator<TValue> | undefined
    value: TValue
    synchronousValidatorsValid: boolean
}

type QueryResult<TValue> = ValidatorOutput & { valueComputedFor: TValue }

interface UseAsyncValidatorOptions<TValue> {
    value: TValue
    synchronousValidatorsValid: boolean

    asyncValidator: AsyncValidator<TValue> | undefined
    onError(e: unknown): void

    debounceDelay?: number
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
    asyncValidator,
    debounceDelay
}: UseAsyncValidatorOptions<TValue>): UseAsyncValidatorOutput {
    const [asyncValidationInProgress, setAsyncValidationInProgress] = useState(false)

    // Separate useState calls to prevent unnecessary updates
    const [valid, setValid] = useState<boolean>(!asyncValidator)
    const [invalidFeedback, setInvalidFeedback] = useState<React.ReactNode>()
    const [valueComputedFor, setValueComputedFor] = useState<TValue>()

    const queryParams = useMemo(
        () => ({ asyncValidator, value, synchronousValidatorsValid }),
        [asyncValidator, value, synchronousValidatorsValid]
    )

    useParameterizedQuery<QueryParams<TValue>, QueryResult<TValue>>({
        queryParams,
        shouldQueryImmediately: (prev, cur) =>
            prev.asyncValidator !== cur.asyncValidator ||
            prev.synchronousValidatorsValid !== cur.synchronousValidatorsValid,
        query: (qp): CancellablePromise<QueryResult<TValue>> => {
            if (!qp.asyncValidator) {
                return CancellablePromise.resolve({
                    valueComputedFor: qp.value,
                    valid: true,
                    invalidFeedback: undefined
                })
            }

            if (!synchronousValidatorsValid) {
                return CancellablePromise.resolve({
                    valueComputedFor: qp.value,
                    valid: false,
                    invalidFeedback: undefined
                })
            }

            return qp
                .asyncValidator(qp.value)
                .then(validatorOutput => ({
                    valueComputedFor: qp.value,
                    ...validatorOutput
                }))
        },
        onResultReceived: ({ valueComputedFor, valid, invalidFeedback }) => {
            setValueComputedFor(valueComputedFor)
            setValid(valid)
            setInvalidFeedback(invalidFeedback)
        },
        onLoadingChange: setAsyncValidationInProgress,
        onError,
        debounceDelay
    })

    let asyncValidatorOutput: ValidatorOutput

    const debounceInProgress = value !== valueComputedFor

    if (asyncValidationInProgress || debounceInProgress) {
        asyncValidatorOutput = {
            valid: false,
            invalidFeedback: undefined
        }
    } else {
        asyncValidatorOutput = { valid, invalidFeedback }
    }

    return { asyncValidatorOutput, asyncValidationInProgress }
}
