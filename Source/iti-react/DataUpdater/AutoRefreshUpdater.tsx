import { debounce } from 'lodash'
import * as moment from 'moment'
import { IDataUpdater } from './DataUpdater'

export interface IAutoRefreshUpdaterOptions<TQueryParams, TResult> {
    dataUpdater: IDataUpdater<TQueryParams>

    onRefreshingChange: (refreshing: boolean) => void
    refreshInterval: moment.Duration
    onError(e: any): void
}

export class AutoRefreshUpdater<TQueryParams, TResult>
    implements IDataUpdater<TQueryParams> {
    private dataUpdater: IDataUpdater<TQueryParams>

    private onRefreshingChange: (refreshing: boolean) => void = () => {}
    private onError: (e: any) => void

    private autoRefreshTimer?: number
    private refreshInterval: moment.Duration

    onQueryStarted: () => void = () => {}

    constructor(options: IAutoRefreshUpdaterOptions<TQueryParams, TResult>) {
        this.dataUpdater = options.dataUpdater
        this.onError = options.onError

        this.onRefreshingChange = options.onRefreshingChange
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

    private clearTimer = () => {
        if (typeof this.autoRefreshTimer !== 'undefined') {
            window.clearTimeout(this.autoRefreshTimer)
        }
    }

    private resetAutoRefreshTimer() {
        this.clearTimer()

        this.autoRefreshTimer = window.setTimeout(
            this.refresh,
            this.refreshInterval.asMilliseconds()
        )
    }

    private refresh = async () => {
        this.onRefreshingChange(true)

        try {
            await this.dataUpdater.doQueryAsync(false)
        } catch (e) {
            this.onError(e)
        }

        this.onRefreshingChange(false)
    }

    doQuery = (changeLoading?: boolean) => this.dataUpdater.doQuery(changeLoading)
    doQueryAsync = async (changeLoading?: boolean) =>
        await this.dataUpdater.doQueryAsync(changeLoading)

    handleQueryParamsChange = (queryParams: TQueryParams, shouldDebounce: boolean) =>
        this.dataUpdater.handleQueryParamsChange(queryParams, shouldDebounce)

    dispose() {
        this.clearTimer()
        this.dataUpdater.dispose()
    }
}
