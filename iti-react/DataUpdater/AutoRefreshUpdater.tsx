import * as moment from 'moment'
import { IDataUpdater } from './DataUpdater'

/* A pitfall when using AutoRefreshUpdater: imagine there are 10 entities shown per
 * page, there are currently 11 entities in the DB, and the user is viewing page 2.
 * Someone else deletes one of the entities. Now, when the AutoRefreshUpdater does
 * its query, there are only 10 entities e.g. 1 page. So the user is now viewing
 * a page that no longer exists.
 *
 *     const expectedPage = preventNonExistentPage(
 *         queryParams.page,
 *         totalPages
 *     )
 *
 *     if (queryParams.page === expectedPage) {
 *         // everything OK - setState with the results of the query
 *     } else {
 *         // nonexistent page - set queryParams.page to expectedPage
 *     }
 *
 * where preventNonExistentPage is
 *
 *     export function preventNonExistentPage(page: number, totalPages: number): number {
 *         if (totalPages <= 1) return 1
 *
 *         if (page > totalPages) return totalPages
 *
 *         return page
 *     }
 */

/* connectionErrorThreshold was added because single API calls can fail in certain
 * cases when the user actually does have an internet connection. The case that I've
 * observed is when the computer has been asleep. The AutoRefreshUpdater will typically
 * query immediately after the computer resumes, and the request will fail because
 * network IO hasn't been re-enabled yet.
 */

export interface AutoRefreshUpdaterOptions<TQueryParams> {
    dataUpdater: IDataUpdater<TQueryParams>

    onRefreshingChange?: (refreshing: boolean) => void
    refreshInterval: moment.Duration

    // number of consecutive errors required to trigger onConnectionError()
    connectionErrorThreshold?: number

    isConnectionError(e: any): boolean
    onConnectionError(): void
    onOtherError(e: any): void
}

export class AutoRefreshUpdater<TQueryParams> implements IDataUpdater<TQueryParams> {
    private dataUpdater: IDataUpdater<TQueryParams>

    private onRefreshingChange: (refreshing: boolean) => void = () => {}
    private onOtherError: (e: any) => void
    private onConnectionError: () => void

    private autoRefreshTimer?: number
    private refreshInterval: moment.Duration

    private isConnectionError: (e: any) => boolean
    private connectionErrorThreshold: number
    consecutiveConnectionErrorCount = 0

    onQueryStarted: () => void = () => {}

    constructor(options: AutoRefreshUpdaterOptions<TQueryParams>) {
        this.dataUpdater = options.dataUpdater
        this.onConnectionError = options.onConnectionError
        this.onOtherError = options.onOtherError

        this.onRefreshingChange = options.onRefreshingChange
            ? options.onRefreshingChange
            : () => {}
        this.refreshInterval = options.refreshInterval

        this.isConnectionError = options.isConnectionError
        this.connectionErrorThreshold = options.connectionErrorThreshold
            ? options.connectionErrorThreshold
            : 2 // Default value
    }

    startAutoRefresh() {
        // Reset the timer whenever a query occurs, even if the
        // AutoRefreshUpdater did not initiate it
        this.dataUpdater.onQueryStarted = () => {
            this.resetAutoRefreshTimer()
            this.onQueryStarted()
        }

        this.refresh()
    }

    private resetAutoRefreshTimer() {
        window.window.clearTimeout(this.autoRefreshTimer)

        this.autoRefreshTimer = window.window.setTimeout(
            this.refresh,
            this.refreshInterval.asMilliseconds()
        )
    }

    private refresh = async () => {
        this.onRefreshingChange(true)

        try {
            await this.dataUpdater.doQueryAsync(false)

            // Don't call this if query gets cancelled (to avoid setState after unmount)
            this.onRefreshingChange(false)
            this.consecutiveConnectionErrorCount = 0
        } catch (e) {
            if (this.isConnectionError(e)) {
                this.consecutiveConnectionErrorCount++

                if (
                    this.consecutiveConnectionErrorCount >= this.connectionErrorThreshold
                ) {
                    this.onConnectionError()
                }
            } else {
                this.onOtherError(e)
            }
        }
    }

    doQuery = (changeLoading?: boolean) => this.dataUpdater.doQuery(changeLoading)
    doQueryAsync = async (changeLoading?: boolean) =>
        await this.dataUpdater.doQueryAsync(changeLoading)

    handleQueryParamsChange = (
        queryParams: TQueryParams,
        shouldDebounce: boolean,
        changeLoading?: boolean
    ) =>
        this.dataUpdater.handleQueryParamsChange(
            queryParams,
            shouldDebounce,
            changeLoading
        )

    dispose() {
        window.window.clearTimeout(this.autoRefreshTimer)
        this.dataUpdater.dispose()
    }
}
