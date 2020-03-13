import { useRef, useEffect, useCallback } from 'react'
import { defaults, noop } from 'lodash'
import { CancellablePromise } from '../../CancellablePromise'
import { usePrevious } from '../UsePrevious'

interface DoQueryInternalOptions {
    changeLoading: boolean
    handleErrors: boolean
}

const defaultDoQueryInternalOptions: DoQueryInternalOptions = {
    changeLoading: true,
    handleErrors: true
}

export interface UseParameterizedQueryOptions<TQueryParams, TResult> {
    // must be referentially stable, otherwise there could be an infinite loop
    queryParams: TQueryParams

    // `query` must not depend on any outside variables, e.g. props!!!
    // Changing the query alone does not cause useParameterizedQuery to
    // re-execute the query.
    query(queryParams: TQueryParams): CancellablePromise<TResult>
    shouldQueryImmediately(
        prevQueryParams: TQueryParams,
        queryParams: TQueryParams
    ): boolean

    onResultReceived(result: TResult): void
    onLoadingChange?(loading: boolean): void
    onError(e: unknown): void

    debounceDelay?: number
    onQueryStarted?(): void
}

interface ReturnType {
    doQuery(options?: { changeLoading: boolean }): void
    doQueryAsync(options?: { changeLoading: boolean }): Promise<void>
}

export function useParameterizedQuery<TQueryParams, TResult>(
    options: UseParameterizedQueryOptions<TQueryParams, TResult>
): ReturnType {
    const {
        queryParams,
        shouldQueryImmediately,
        debounceDelay,
        ...otherOptions
    } = defaults(options, {
        onLoadingChange: noop,
        onQueryStarted: noop,
        debounceDelay: 500
    })

    const queryRef = useRef(otherOptions.query)
    const onQueryStartedRef = useRef(otherOptions.onQueryStarted)
    const onLoadingChangeRef = useRef(otherOptions.onLoadingChange)
    const onResultReceivedRef = useRef(otherOptions.onResultReceived)
    const onErrorRef = useRef(otherOptions.onError)

    useEffect(() => {
        queryRef.current = otherOptions.query
        onQueryStartedRef.current = otherOptions.onQueryStarted
        onLoadingChangeRef.current = otherOptions.onLoadingChange
        onResultReceivedRef.current = otherOptions.onResultReceived
        onErrorRef.current = otherOptions.onError
    })

    const query = useCallback(() => queryRef.current(queryParams), [queryParams])

    const queryPromiseRef = useRef<CancellablePromise<unknown>>(
        CancellablePromise.resolve()
    )

    const doQueryInternal = useCallback(
        async (options?: Partial<DoQueryInternalOptions>): Promise<void> => {
            const { changeLoading, handleErrors } = defaults(
                options,
                defaultDoQueryInternalOptions
            )

            onQueryStartedRef.current()
            if (changeLoading) onLoadingChangeRef.current(true)

            const promise = query()
            queryPromiseRef.current = promise

            try {
                const result = await promise

                onResultReceivedRef.current(result)

                // Only call onLoadingChange(false) on successful queries to prevent the
                // following undesirable behavior:
                //
                // 1. query1 calls onLoadingChange(true)
                // 2. queryParams change while query1 is still in progress.
                // 3. query2 calls onLoadingChange(true) and cancels query1's promise
                // 4. The catch and finally blocks execute for query1. If we call
                //    onLoadingChange(false) in the finally block, this overwrites the
                //    onLoadingChange(true) from query2. Now loading=false even though
                //    a query is in progress.
                if (changeLoading) onLoadingChangeRef.current(false)
            } catch (e) {
                if (handleErrors) {
                    onErrorRef.current(e)
                } else {
                    throw e
                }
            }
        },
        [query]
    )

    useEffect(() => {
        return (): void => {
            queryPromiseRef.current.cancel()
        }
    }, [])

    const doQueryInternalRef = useRef(doQueryInternal)
    useEffect(() => {
        doQueryInternalRef.current = doQueryInternal
    })

    const prevQueryParams = usePrevious(queryParams)
    const shouldQueryImmediatelyBool = prevQueryParams
        ? shouldQueryImmediately(queryParams, prevQueryParams)
        : false

    useEffect(() => {
        if (shouldQueryImmediatelyBool) {
            doQueryInternal()
            return undefined
        }

        const promise = CancellablePromise.delay(debounceDelay).then(
            () => doQueryInternalRef.current(),
            () => Promise.resolve() // no-op
        )

        // This only cancels the delay, not the query.
        // So if the user stops typing for more than `debounceDelay`, the query
        // will be started and allowed to complete (unless queryParamsJson changes
        // while the query is in progress).
        return promise.cancel
    }, [shouldQueryImmediatelyBool, doQueryInternal, debounceDelay])

    const doQuery = useCallback(
        (options: { changeLoading: boolean } = { changeLoading: true }): void => {
            doQueryInternalRef.current({
                handleErrors: true,
                changeLoading: options.changeLoading
            })
        },
        []
    )

    const doQueryAsync = useCallback(
        (
            options: { changeLoading: boolean } = { changeLoading: true }
        ): Promise<void> => {
            return doQueryInternalRef.current({
                handleErrors: false,
                changeLoading: options.changeLoading
            })
        },
        []
    )

    return {
        doQuery,
        doQueryAsync
    }
}
