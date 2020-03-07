import { UseParameterizedQueryOptions } from './UseParameterizedQuery'
import {
    AutoRefreshOptions,
    useParameterizedAutoRefreshQuery
} from './UseParameterizedAutoRefreshQuery'

// Outside of useQuery to keep a stable identity
const emptyQueryParams = {}

export type UseAutoRefreshQueryOptions<TResult> = Pick<
    UseParameterizedQueryOptions<{}, TResult>,
    'query' | 'onResultReceived' | 'onLoadingChange'
> &
    AutoRefreshOptions

// useParameterizedAutoRefreshQuery, without the QueryParams
export function useAutoRefreshQuery<TResult>(
    options: UseAutoRefreshQueryOptions<TResult>
): ReturnType<typeof useParameterizedAutoRefreshQuery> {
    return useParameterizedAutoRefreshQuery<{}, TResult>({
        ...options,
        queryParams: emptyQueryParams,
        shouldQueryImmediately: (): true => true
    })
}
