import { useContext, useRef, useEffect, useCallback, useState } from 'react'
import * as moment from 'moment-timezone'
import {
    useParameterizedQuery,
    UseParameterizedQueryOptions
} from './UseParameterizedQuery'
import { ItiReactContext } from '@interface-technologies/iti-react'
import { defaults } from 'lodash'

/* connectionErrorThreshold was added because single API calls can fail in certain
 * cases when the user actually does have an internet connection. The case that we've
 * observed is when the computer has been asleep. The AutoRefreshUpdater will typically
 * query immediately after the computer resumes, and the request will fail because
 * network IO hasn't been re-enabled yet.
 */

export interface AutoRefreshOptions {
    refreshInterval?: moment.Duration
    onRefreshingChange?: (refreshing: boolean) => void

    onConnectionError(): void
    onOtherError(e: any): void

    startAutoRefreshOnMount?: boolean
}

export type UseParameterizedAutoRefreshQueryOptions<TQueryParams, TResult> = Pick<
    UseParameterizedQueryOptions<TQueryParams, TResult>,
    | 'queryParams'
    | 'query'
    | 'shouldQueryImmediately'
    | 'onResultReceived'
    | 'onLoadingChange'
    | 'debounceDelay'
> &
    AutoRefreshOptions

export function useParameterizedAutoRefreshQuery<TQueryParams, TResult>(
    options: UseParameterizedAutoRefreshQueryOptions<TQueryParams, TResult>
) {
    const {
        defaultRefreshInterval,
        isConnectionError,
        connectionErrorThreshold
    } = useContext(ItiReactContext).useAutoRefreshQuery

    const {
        refreshInterval,
        onRefreshingChange,
        onConnectionError,
        onOtherError,
        startAutoRefreshOnMount
    } = defaults(options, {
        onRefreshingChange: () => {},
        refreshInterval: defaultRefreshInterval,
        startAutoRefreshOnMount: true
    })

    const autoRefreshTimerRef = useRef<number>()
    const [shouldRestartTimer, setShouldRestartTimer] = useState(false)

    // So that onConnectionError is called immediately if the initial query fails
    const consecutiveConnectionErrorCountRef = useRef(connectionErrorThreshold - 1)

    function onError(e: any) {
        if (isConnectionError(e)) {
            consecutiveConnectionErrorCountRef.current++

            if (consecutiveConnectionErrorCountRef.current >= connectionErrorThreshold) {
                onConnectionError()
            }
        } else {
            onOtherError(e)
        }
    }

    const { doQuery, doQueryAsync } = useParameterizedQuery({
        queryParams: options.queryParams,
        query: options.query,
        shouldQueryImmediately: options.shouldQueryImmediately,
        onResultReceived: options.onResultReceived,
        onLoadingChange: options.onLoadingChange,
        queryOnMount: false,
        debounceDelay: options.debounceDelay,
        onQueryStarted: () => setShouldRestartTimer(true),
        onError
    })

    async function refresh() {
        onRefreshingChange(true)

        try {
            await doQueryAsync({ changeLoading: false })
            consecutiveConnectionErrorCountRef.current = 0

            // See note in useParameterizedQuery about onLoadingChange for why
            // onRefreshingChange(false) should NOT be called in a finally block
            onRefreshingChange(false)
        } catch (e) {
            onError(e)
        }
    }

    useEffect(() => {
        if (shouldRestartTimer) {
            setShouldRestartTimer(false)
            window.clearTimeout(autoRefreshTimerRef.current)

            autoRefreshTimerRef.current = window.setTimeout(
                refresh,
                refreshInterval.asMilliseconds()
            )
        }
    }, [shouldRestartTimer])

    function startAutoRefresh(): void {
        refresh()
    }

    const isFirstExecutionRef = useRef(true)

    useEffect(() => {
        if (isFirstExecutionRef.current) {
            isFirstExecutionRef.current = false

            if (startAutoRefreshOnMount) {
                startAutoRefresh()
            }
        }
    }, [])

    // Final cleanup
    useEffect(() => {
        return () => {
            window.clearTimeout(autoRefreshTimerRef.current)
        }
    }, [])

    return { doQuery, doQueryAsync, startAutoRefresh }
}
