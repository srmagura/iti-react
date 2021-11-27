import { useState, useMemo, useContext, useEffect, useRef } from 'react'
import { CancellablePromise } from 'real-cancellable-promise'
import {
    ValidatorOutput,
    AsyncValidator,
    ASYNC_VALIDATION_PENDING,
    ASYNC_VALIDATION_DEBOUNCE_PENDING,
    INVALID_NO_FEEDBACK,
} from '../Validator'
import { useSimpleQuery } from '../../Hooks'
import { ItiReactCoreContext } from '../../ItiReactCoreContext'

interface QueryParams<TValue> {
    asyncValidator: AsyncValidator<TValue> | undefined
    value: TValue
    synchronousValidatorsValid: boolean
}

interface QueryResult<TValue> {
    valueComputedFor: TValue
    validatorOutput: ValidatorOutput
}

interface UseAsyncValidatorOptions<TValue> {
    value: TValue
    synchronousValidatorsValid: boolean

    asyncValidator: AsyncValidator<TValue> | undefined
    onError?(e: unknown): void

    debounceDelay?: number
}

/** @internal */
export function useAsyncValidator<TValue>({
    value,
    synchronousValidatorsValid,
    onError,
    asyncValidator,
    debounceDelay,
}: UseAsyncValidatorOptions<TValue>): ValidatorOutput {
    usePropCheck(asyncValidator)

    const onErrorFromContext = useContext(ItiReactCoreContext).onError
    onError = onError ?? onErrorFromContext

    const [queryInProgress, setQueryInProgress] = useState(false)

    // If asyncValidator is provided, start invalid.
    // If asyncValidator is not provided, start valid.
    const [validatorOutput, setValidatorOutput] = useState<ValidatorOutput>(
        asyncValidator ? ASYNC_VALIDATION_PENDING : undefined
    )
    const [valueComputedFor, setValueComputedFor] = useState<TValue>()

    const queryParams = useMemo(
        () => ({ asyncValidator, value, synchronousValidatorsValid }),
        [asyncValidator, value, synchronousValidatorsValid]
    )

    useSimpleQuery<QueryParams<TValue>, QueryResult<TValue>>({
        queryParams,
        shouldQueryImmediately: (prev, cur) => prev.asyncValidator !== cur.asyncValidator,
        query: (qp): CancellablePromise<QueryResult<TValue>> => {
            if (!qp.asyncValidator) throw new Error('asyncValidator is undefined.')

            return qp.asyncValidator(qp.value).then((validatorOutput) => ({
                valueComputedFor: qp.value,
                validatorOutput,
            }))
        },
        onResultReceived: ({ valueComputedFor, validatorOutput }) => {
            setValueComputedFor(valueComputedFor)
            setValidatorOutput(validatorOutput)
        },
        onLoadingChange: setQueryInProgress,
        onError,
        debounceDelay,

        // prevent onResultReceived from causing asynchronous updates if there
        // is no asyncValidator. These async updates are a pain in the ass
        // while writing tests, since all updates to React components must
        // occur within an act() call.
        shouldSkipQuery: (qp) => !qp.asyncValidator || !qp.synchronousValidatorsValid,
    })

    if (!asyncValidator) return undefined

    if (!synchronousValidatorsValid) return INVALID_NO_FEEDBACK

    if (queryInProgress) return ASYNC_VALIDATION_PENDING

    if (value !== valueComputedFor && asyncValidator)
        return ASYNC_VALIDATION_DEBOUNCE_PENDING

    return validatorOutput
}

function usePropCheck<T>(asyncValidator: AsyncValidator<T> | undefined): void {
    const asyncValidatorDefined = !!asyncValidator
    const isFirstTimeRef = useRef(true)

    useEffect(() => {
        if (!isFirstTimeRef.current) {
            throw new Error(
                'Changing asyncValidator from defined to undefined (or vice versa) ' +
                    'is not supported.'
            )
        }

        isFirstTimeRef.current = false
    }, [asyncValidatorDefined])
}
