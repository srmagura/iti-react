import { UseParameterizedQueryOptions } from './UseParameterizedQuery'
import {
    AutoRefreshOptions,
    useParameterizedAutoRefreshQuery
} from './UseParameterizedAutoRefreshQuery'

// Outside of useQuery to keep a stable identity
const emptyQueryParams = {}

export interface UseAutoRefreshQueryOptions<TResult>
    extends Pick<
        UseParameterizedQueryOptions<{}, TResult>,
        'query' | 'onResultReceived' | 'onLoadingChange' | 'debounceDelay'
    > {
    autoRefresh: AutoRefreshOptions
}

// useParameterizedAutoRefreshQuery, without the QueryParams
export function useAutoRefreshQuery<TResult>(
    options: UseAutoRefreshQueryOptions<TResult>
) {
    const { query, onResultReceived, onLoadingChange } = options

    return useParameterizedAutoRefreshQuery<{}, TResult>({
        queryParams: emptyQueryParams,
        query,
        shouldQueryImmediately: () => true,

        onResultReceived,
        onLoadingChange,

        autoRefresh: options.autoRefresh
    })
}
