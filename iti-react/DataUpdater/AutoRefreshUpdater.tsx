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

export interface AutoRefreshUpdaterOptions<TQueryParams> {
    dataUpdater: IDataUpdater<TQueryParams>

    onRefreshingChange?: (refreshing: boolean) => void
    refreshInterval: moment.Duration
    onError(e: any): void
}

export class AutoRefreshUpdater<TQueryParams> implements IDataUpdater<TQueryParams> {
    private dataUpdater: IDataUpdater<TQueryParams>

    private onRefreshingChange: (refreshing: boolean) => void = () => {}
    private onError: (e: any) => void

    private autoRefreshTimer?: number
    private refreshInterval: moment.Duration

    onQueryStarted: () => void = () => {}

    constructor(options: AutoRefreshUpdaterOptions<TQueryParams>) {
        this.dataUpdater = options.dataUpdater
        this.onError = options.onError

        this.onRefreshingChange = options.onRefreshingChange
            ? options.onRefreshingChange
            : () => {}
        this.refreshInterval = options.refreshInterval
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
        window.clearTimeout(this.autoRefreshTimer)

        this.autoRefreshTimer = window.setTimeout(
            this.refresh,
            this.refreshInterval.asMilliseconds()
        )
    }

    private refresh = async () => {
        this.onRefreshingChange(true)

        try {
            await this.dataUpdater.doQueryAsync(false)

            // Don't call this if query gets cancelled
            this.onRefreshingChange(false)
        } catch (e) {
            this.onError(e)
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
        window.clearTimeout(this.autoRefreshTimer)
        this.dataUpdater.dispose()
    }
}
