import { useQuery, UseQueryProps } from './UseQuery'

// `query` must not depend on any outside variables, e.g. props!!!
export type UseQueryOptions<TResult> = Pick<
    UseQueryProps<undefined, TResult>,
    'query' | 'onResultReceived' | 'onLoadingChange' | 'onError'
>

export function useParameterlessQuery<TResult>(
    options: UseQueryOptions<TResult>
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
