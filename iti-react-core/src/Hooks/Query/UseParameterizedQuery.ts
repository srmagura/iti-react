import { useRef, useEffect, useCallback } from 'react'
import { defaults, noop } from 'lodash'
import { CancellablePromise } from '../../CancellablePromise'

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
    const { queryParams, debounceDelay, ...props } = defaults(options, {
        onLoadingChange: noop,
        onQueryStarted: noop,
        debounceDelay: 500
    })

    const queryRef = useRef(props.query)
    const onQueryStartedRef = useRef(props.onQueryStarted)
    const onLoadingChangeRef = useRef(props.onLoadingChange)
    const onResultReceivedRef = useRef(props.onResultReceived)
    const onErrorRef = useRef(props.onError)
    const shouldQueryImmediatelyRef = useRef(props.shouldQueryImmediately)

    useEffect(() => {
        queryRef.current = props.query
        onQueryStartedRef.current = props.onQueryStarted
        onLoadingChangeRef.current = props.onLoadingChange
        onResultReceivedRef.current = props.onResultReceived
        onErrorRef.current = props.onError
        shouldQueryImmediatelyRef.current = props.shouldQueryImmediately
    })

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

            const promise = queryRef.current(queryParams)
            queryPromiseRef.current.cancel()
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
        [queryParams]
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

    const prevQueryParamsRef = useRef<TQueryParams>()

    useEffect(() => {
        const shouldQueryImmediatelyBool = prevQueryParamsRef.current
            ? shouldQueryImmediatelyRef.current(queryParams, prevQueryParamsRef.current)
            : true
        prevQueryParamsRef.current = queryParams

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
        // will be started and allowed to complete (unless queryParams changes
        // while the query is in progress).
        return promise.cancel
    }, [doQueryInternal, debounceDelay, queryParams])

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
