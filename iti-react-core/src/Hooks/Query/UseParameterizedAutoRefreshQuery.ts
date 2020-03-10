import { useContext, useRef, useEffect, useState, useCallback } from 'react'
import moment from 'moment-timezone'
import { defaults, noop } from 'lodash'
import {
    useParameterizedQuery,
    UseParameterizedQueryOptions
} from './UseParameterizedQuery'
import { ItiReactCoreContext } from '../../ItiReactCoreContext'

// Explicitly declare these functions to avoid ambiguity with NodeJS timers
declare function setTimeout(func: () => void, delay: number): number
declare function clearTimeout(timer: number | undefined): void

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
    onOtherError(e: unknown): void
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

interface ReturnType {
    doQuery(options?: { changeLoading: boolean }): void
    doQueryAsync(options?: { changeLoading: boolean }): Promise<void>
}

export function useParameterizedAutoRefreshQuery<TQueryParams, TResult>(
    options: UseParameterizedAutoRefreshQueryOptions<TQueryParams, TResult>
): ReturnType {
    const {
        defaultRefreshInterval,
        isConnectionError,
        connectionErrorThreshold
    } = useContext(ItiReactCoreContext).useAutoRefreshQuery

    const {
        refreshInterval,
        onRefreshingChange,
        onConnectionError,
        onOtherError
    } = defaults(options, {
        onRefreshingChange: noop,
        refreshInterval: defaultRefreshInterval,
        startAutoRefreshOnMount: true
    })

    const autoRefreshTimerRef = useRef<number>()

    const [shouldRestartTimer, setShouldRestartTimer] = useState(false)

    // So that onConnectionError is called immediately if the initial query fails
    const consecutiveConnectionErrorCountRef = useRef(connectionErrorThreshold - 1)

    const onError = useCallback(
        (e: unknown): void => {
            if (isConnectionError(e)) {
                consecutiveConnectionErrorCountRef.current += 1

                if (
                    consecutiveConnectionErrorCountRef.current >= connectionErrorThreshold
                ) {
                    onConnectionError()
                }
            } else {
                onOtherError(e)
            }
        },
        [isConnectionError, connectionErrorThreshold, onConnectionError, onOtherError]
    )

    const { doQuery, doQueryAsync } = useParameterizedQuery({
        queryParams: options.queryParams,
        query: options.query,
        shouldQueryImmediately: options.shouldQueryImmediately,
        onResultReceived: options.onResultReceived,
        onLoadingChange: options.onLoadingChange,
        debounceDelay: options.debounceDelay,
        onQueryStarted: useCallback(() => setShouldRestartTimer(true), []),
        onError
    })

    const refresh = useCallback(async (): Promise<void> => {
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
    }, [doQueryAsync, onRefreshingChange, onError])

    const refreshIntervalMilliseconds = refreshInterval.asMilliseconds()

    useEffect(() => {
        if (shouldRestartTimer) {
            setShouldRestartTimer(false)
            window.clearTimeout(autoRefreshTimerRef.current)

            autoRefreshTimerRef.current = setTimeout(refresh, refreshIntervalMilliseconds)
        }
    }, [shouldRestartTimer, refresh, refreshIntervalMilliseconds])

    // Final cleanup
    useEffect(() => {
        return (): void => {
            window.clearTimeout(autoRefreshTimerRef.current)
        }
    }, [])

    return { doQuery, doQueryAsync }
}
