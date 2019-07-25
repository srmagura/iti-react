import { CancellablePromise } from '@interface-technologies/iti-react-core'
import {
    useParameterizedQuery,
    UseParameterizedQueryOptions
} from './UseParameterizedQuery'

// Outside of useQuery to keep a stable identity
const emptyQueryParams = {}

export type UseQueryOptions<TResult> = Pick<
    UseParameterizedQueryOptions<{}, TResult>,
    | 'query'
    | 'onResultReceived'
    | 'onLoadingChange'
    | 'onError'
    | 'debounceDelay'
    | 'queryOnMount'
>

// useParameterizedQuery, without the QueryParams
export function useQuery<TResult>(options: UseQueryOptions<TResult>) {
    const { query, onResultReceived, onLoadingChange, onError, queryOnMount } = options

    return useParameterizedQuery<{}, TResult>({
        queryParams: emptyQueryParams,
        query,
        shouldQueryImmediately: () => true,

        onResultReceived,
        onLoadingChange,
        onError,

        queryOnMount
    })
}
