import { UseParameterizedQueryOptions } from './UseParameterizedQuery'
import {
    AutoRefreshOptions,
    useParameterizedAutoRefreshQuery
} from './UseParameterizedAutoRefreshQuery'

// `query` must not depend on any outside variables, e.g. props!!!
export type UseAutoRefreshQueryOptions<TResult> = Pick<
    UseParameterizedQueryOptions<undefined, TResult>,
    'query' | 'onResultReceived' | 'onLoadingChange'
> &
    AutoRefreshOptions

// useParameterizedAutoRefreshQuery, without the QueryParams
export function useAutoRefreshQuery<TResult>(
    options: UseAutoRefreshQueryOptions<TResult>
): ReturnType<typeof useParameterizedAutoRefreshQuery> {
    return useParameterizedAutoRefreshQuery<undefined, TResult>({
        ...options,
        queryParams: undefined,
        shouldQueryImmediately: () => true
    })
}
