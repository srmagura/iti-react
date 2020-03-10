﻿import {
    useParameterizedQuery,
    UseParameterizedQueryOptions
} from './UseParameterizedQuery'

// Outside of useQuery to keep a stable identity
const emptyQueryParams = {}

export type UseQueryOptions<TResult> = Pick<
    UseParameterizedQueryOptions<{}, TResult>,
    'query' | 'onResultReceived' | 'onLoadingChange' | 'onError'
>

// useParameterizedQuery, without the QueryParams
export function useQuery<TResult>(
    options: UseQueryOptions<TResult>
): ReturnType<typeof useParameterizedQuery> {
    const { query, onResultReceived, onLoadingChange, onError } = options

    return useParameterizedQuery<{}, TResult>({
        queryParams: emptyQueryParams,
        query,
        shouldQueryImmediately: () => true,

        onResultReceived,
        onLoadingChange,
        onError
    })
}
