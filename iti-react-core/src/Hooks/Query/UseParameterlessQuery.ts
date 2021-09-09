import { useQuery, UseQueryProps } from './UseQuery'

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
 */
export function useParameterlessQuery<TResult>(
    options: UseParameterlessQueryProps<TResult>
): ReturnType<typeof useQuery> {
    const { query, onResultReceived, onLoadingChange, onError } = options

    return useQuery<undefined, TResult>({
        queryParams: undefined,
        query,
        shouldQueryImmediately: () => true,

        onResultReceived,
        onLoadingChange,
        onError,
    })
}
