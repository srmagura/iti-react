﻿import { useQuery, UseQueryProps, UseQueryReturn } from './UseQuery'

/**
 * @category Hooks
 */
export type UseParameterlessQueryProps<TResult> = Pick<
    UseQueryProps<undefined, TResult>,
    'query' | 'onResultReceived' | 'onLoadingChange' | 'onError'
>

/**
 * Performs a query on mount. Use this when `query` doesn't depend on any outside
 * variables, e.g. props.
 *
 * Example:
 * ```
 * const { doQuery, doQueryAsync } = useParameterlessQuery<number>({
 *     query: api.workDoc.getCount,
 *     onResultReceived: (count) => {
 *         setCount(count)
 *     }
 * })
 * ```
 *
 * @typeParam TResult the type returned by the query
 * @category Hooks
 */
export function useParameterlessQuery<TResult>({
    query,
    onResultReceived,
    onLoadingChange,
    onError,
}: UseParameterlessQueryProps<TResult>): UseQueryReturn {
    return useQuery<undefined, TResult>({
        queryParams: undefined,
        query,
        shouldQueryImmediately: () => true,

        onResultReceived,
        onLoadingChange,
        onError,
    })
}
