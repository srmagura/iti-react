import { useContext, useRef, useEffect, useCallback } from 'react'
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

export interface UseParameterizedAutoRefreshQueryOptions<TQueryParams, TResult>
    extends Pick<
        UseParameterizedQueryOptions<TQueryParams, TResult>,
        | 'queryParams'
        | 'query'
        | 'shouldQueryImmediately'
        | 'onResultReceived'
        | 'onLoadingChange'
        | 'debounceDelay'
    > {
    autoRefresh: AutoRefreshOptions
}

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
    } = defaults(options.autoRefresh, {
        onRefreshingChange: () => {},
        refreshInterval: defaultRefreshInterval,
        startAutoRefreshOnMount: true
    })

    const autoRefreshTimerRef = useRef<number>()
    let shouldRestartTimer = false

    const consecutiveConnectionErrorCountRef = useRef(0)

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

    function resetAutoRefreshTimer() {
        window.clearTimeout(autoRefreshTimerRef.current)
        shouldRestartTimer = true
    }

    const { doQuery, doQueryAsync } = useParameterizedQuery({
        queryParams: options.queryParams,
        query: options.query,
        shouldQueryImmediately: options.shouldQueryImmediately,
        onResultReceived: options.onResultReceived,
        onLoadingChange: options.onLoadingChange,
        debounceDelay: options.debounceDelay,
        onQueryStarted: resetAutoRefreshTimer,
        onError
    })

    const refresh = useCallback(async () => {
        onRefreshingChange(true)

        try {
            await doQueryAsync()
        } catch (e) {
            onError(e)
            return
        }

        onRefreshingChange(false)
        consecutiveConnectionErrorCountRef.current = 0
    }, [])

    useEffect(() => {
        if (shouldRestartTimer) {
            window.setTimeout(refresh, refreshInterval.asMilliseconds())
        }
    }, [shouldRestartTimer])

    const startAutoRefresh = refresh
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
