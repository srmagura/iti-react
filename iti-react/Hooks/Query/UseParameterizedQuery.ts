import { useRef, useEffect, useCallback } from 'react'
import { CancellablePromise } from '@interface-technologies/iti-react'
import { defaults } from 'lodash'
import { useDebouncedCallback } from 'use-debounce'

// TODO:SAM MOVE TO ITI-REACT

interface DoQueryInternalOptions {
    changeLoading: boolean
    handleErrors: boolean
}

const defaultDoQueryInternalOptions: DoQueryInternalOptions = {
    changeLoading: true,
    handleErrors: true
}

export interface UseParameterizedQueryOptions<TQueryParams, TResult> {
    // does not need to have a stable identity - JSON.stringify is used
    // for comparisons
    queryParams: TQueryParams

    // changing the query alone does not cause useParameterizedQuery to
    // re-execute the query
    query(queryParams: TQueryParams): CancellablePromise<TResult>
    shouldQueryImmediately(
        queryParams: TQueryParams,
        prevQueryParams: TQueryParams
    ): boolean

    onResultReceived(result: TResult): void
    onLoadingChange?(loading: boolean): void
    onError(e: any): void

    // Less common options
    queryOnMount?: boolean
    debounceDelay?: number
    onQueryStarted?(): void
}

export function useParameterizedQuery<TQueryParams, TResult>(
    options: UseParameterizedQueryOptions<TQueryParams, TResult>
) {
    const {
        queryParams,
        query,
        onResultReceived,
        onError,
        onQueryStarted,
        onLoadingChange,
        shouldQueryImmediately,
        debounceDelay,
        queryOnMount
    } = defaults(options, {
        onLoadingChange: () => {},
        onQueryStarted: () => {},
        debounceDelay: 500,
        queryOnMount: true
    })

    const prevQueryParamsRef = useRef<TQueryParams>()
    const queryPromiseRef = useRef<CancellablePromise<unknown>>(
        CancellablePromise.resolve()
    )

    async function doQueryInternal(
        queryParams: TQueryParams,
        options?: Partial<DoQueryInternalOptions>
    ) {
        const { changeLoading, handleErrors } = defaults(
            options,
            defaultDoQueryInternalOptions
        )

        onQueryStarted()
        if (changeLoading) onLoadingChange(true)

        // Cancel the in progress request if there is one
        queryPromiseRef.current.cancel()

        const promise = (queryPromiseRef.current = query(queryParams))

        try {
            const result = await promise

            onResultReceived(result)
            if (changeLoading) onLoadingChange(false)
        } catch (e) {
            if (handleErrors) {
                onError(e)
            } else {
                throw e
            }
        }
    }

    const [doQueryDebounced, cancelPendingFunctionCall] = useDebouncedCallback(
        doQueryInternal,
        debounceDelay
    )

    const isFirstExecutionRef = useRef(true)

    useEffect(() => {
        if (isFirstExecutionRef.current) {
            isFirstExecutionRef.current = false

            if (!queryOnMount) return
        }

        const debounce = prevQueryParamsRef.current
            ? !shouldQueryImmediately(queryParams, prevQueryParamsRef.current)
            : false
        let cancelFunc = undefined

        if (debounce) {
            doQueryDebounced(queryParams)
            cancelFunc = cancelPendingFunctionCall
        } else {
            doQueryInternal(queryParams)
        }

        prevQueryParamsRef.current = queryParams
        return cancelFunc
    }, [JSON.stringify(queryParams)])

    // Final cleanup
    useEffect(() => {
        return () => {
            queryPromiseRef.current.cancel()
        }
    }, [])

    return {
        doQuery: (options: { changeLoading: boolean } = { changeLoading: true }) => {
            doQueryInternal(queryParams, {
                handleErrors: true,
                changeLoading: options.changeLoading
            })
        },

        doQueryAsync: (options: { changeLoading: boolean } = { changeLoading: true }) => {
            return doQueryInternal(queryParams, {
                handleErrors: false,
                changeLoading: options.changeLoading
            })
        }
    }
}
