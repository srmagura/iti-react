import { UseQueryProps } from './UseQuery'
import { AutoRefreshOptions, useAutoRefreshQuery } from './UseAutoRefreshQuery'

// `query` must not depend on any outside variables, e.g. props!!!
export type UseParameterlessAutoRefreshQueryProps<TResult> = Pick<
    UseQueryProps<undefined, TResult>,
    'query' | 'onResultReceived' | 'onLoadingChange'
> &
    AutoRefreshOptions

// useParameterizedAutoRefreshQuery, without the QueryParams
export function useParameterlessAutoRefreshQuery<TResult>(
    props: UseParameterlessAutoRefreshQueryProps<TResult>
): ReturnType<typeof useAutoRefreshQuery> {
    return useAutoRefreshQuery<undefined, TResult>({
        ...props,
        queryParams: undefined,
        shouldQueryImmediately: () => true,
    })
}
