import {
    useParameterizedQuery,
    UseParameterizedQueryOptions
} from './UseParameterizedQuery'

// `query` must not depend on any outside variables, e.g. props!!!
export type UseQueryOptions<TResult> = Pick<
    UseParameterizedQueryOptions<undefined, TResult>,
    'query' | 'onResultReceived' | 'onLoadingChange' | 'onError'
>

// useParameterizedQuery, without the QueryParams
export function useQuery<TResult>(
    options: UseQueryOptions<TResult>
): ReturnType<typeof useParameterizedQuery> {
    const { query, onResultReceived, onLoadingChange, onError } = options

    return useParameterizedQuery<undefined, TResult>({
        queryParams: undefined,
        query,
        shouldQueryImmediately: () => true,

        onResultReceived,
        onLoadingChange,
        onError
    })
}
