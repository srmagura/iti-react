import { useContext } from 'react'
import * as moment from 'moment-timezone'
import { UseParameterizedQuery } from './UseParameterizedQuery'
import { ItiReactContext } from '@interface-technologies/iti-react'
import { defaults } from 'lodash'

/* connectionErrorThreshold was added because single API calls can fail in certain
 * cases when the user actually does have an internet connection. The case that I've
 * observed is when the computer has been asleep. The AutoRefreshUpdater will typically
 * query immediately after the computer resumes, and the request will fail because
 * network IO hasn't been re-enabled yet.
 */

export function useAutoRefreshQuery(options: {
    onRefreshingChange?: (refreshing: boolean) => void
    refreshInterval?: moment.Duration

    onConnectionError(): void
    onOtherError(e: any): void
}) {
    const defaultRefreshInterval = useContext(ItiReactContext).defaultAutoRefreshInterval

    const {
        onRefreshingChange,
        refreshInterval,
        connectionErrorThreshold,
        isConnectionError,
        onConnectionError,
        onOtherError
    } = defaults(options, {
        onRefreshingChange: () => {},
        refreshInterval: defaultRefreshInterval,
        connectionErrorThreshold: 2
    })

    //    //this.connectionErrorThreshold = options.connectionErrorThreshold
    //    //    ? options.connectionErrorThreshold
    //    //    : 2 // Default value

    //startAutoRefresh() {
    //    // Reset the timer whenever a query occurs, even if the
    //    // AutoRefreshUpdater did not initiate it
    //    this.dataUpdater.onQueryStarted = () => {
    //        this.resetAutoRefreshTimer()
    //        this.onQueryStarted()
    //    }

    //    this.refresh()
    //}

    //private resetAutoRefreshTimer() {
    //    window.window.clearTimeout(this.autoRefreshTimer)

    //    this.autoRefreshTimer = window.window.setTimeout(
    //        this.refresh,
    //        this.refreshInterval.asMilliseconds()
    //    )
    //}

    //private refresh = async () => {
    //    this.onRefreshingChange(true)

    //    try {
    //        await this.dataUpdater.doQueryAsync(false)

    //        // Don't call this if query gets cancelled (to avoid setState after unmount)
    //        this.onRefreshingChange(false)
    //        this.consecutiveConnectionErrorCount = 0
    //    } catch (e) {
    //        if (this.isConnectionError(e)) {
    //            this.consecutiveConnectionErrorCount++

    //            if (
    //                this.consecutiveConnectionErrorCount >= this.connectionErrorThreshold
    //            ) {
    //                this.onConnectionError()
    //            }
    //        } else {
    //            this.onOtherError(e)
    //        }
    //    }
    //}

    //doQuery = (changeLoading?: boolean) => this.dataUpdater.doQuery(changeLoading)
    //doQueryAsync = async (changeLoading?: boolean) =>
    //    await this.dataUpdater.doQueryAsync(changeLoading)

    //handleQueryParamsChange = (
    //    queryParams: TQueryParams,
    //    shouldDebounce: boolean,
    //    changeLoading?: boolean
    //) =>
    //    this.dataUpdater.handleQueryParamsChange(
    //        queryParams,
    //        shouldDebounce,
    //        changeLoading
    //    )

    //dispose() {
    //    window.window.clearTimeout(this.autoRefreshTimer)
    //    this.dataUpdater.dispose()
    //}
}
