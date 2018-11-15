import { debounce } from 'lodash'
import { CancellablePromise } from '../CancellablePromise'

export interface IDataUpdater<TQueryParams> {
    doQuery(changeLoading?: boolean): void
    doQueryAsync(changeLoading?: boolean): Promise<void>

    handleQueryParamsChange(
        queryParams: TQueryParams,
        shouldDebounce: boolean,
        changeLoading?: boolean
    ): void
    dispose(): void

    onQueryStarted: () => void
}

export interface DataUpdaterOptions<TQueryParams, TResult> {
    getCurrentQueryParams: () => TQueryParams
    query: (queryParams: TQueryParams) => CancellablePromise<TResult>

    onLoadingChange?: (loading: boolean) => void
    onResultReceived: (result: TResult) => void
    onError: (e: any) => void
}

// Used in situations where you have a query that depends on some query parameters.
// What this class providers over hand-coding it each time is:
// - Supports debouncing
// - The onLoadingChange callback can be used to show a loading indicator while the query is in progress
// - Cancels current query when query params change (it can be easy to forget to do this)
export class DataUpdater<TQueryParams, TResult> implements IDataUpdater<TQueryParams> {
    private readonly getCurrentQueryParams: () => TQueryParams
    private readonly query: (queryParams: TQueryParams) => CancellablePromise<TResult>

    private readonly onLoadingChange: (loading: boolean) => void
    private readonly onResultReceived: (result: TResult) => void
    private readonly onError: (e: any) => void

    private readonly doQueryDebounced: {
        (changeLoading?: boolean): void
        cancel: () => void
    }
    private promise?: CancellablePromise<TResult>

    onQueryStarted: () => void = () => {}

    constructor(options: DataUpdaterOptions<TQueryParams, TResult>) {
        this.getCurrentQueryParams = options.getCurrentQueryParams
        this.query = options.query

        this.onLoadingChange = options.onLoadingChange
            ? options.onLoadingChange
            : () => {}
        this.onResultReceived = options.onResultReceived
        this.onError = options.onError

        this.doQueryDebounced = debounce(
            (changeLoading?: boolean) => this.doQueryInternal(undefined, changeLoading),
            500
        )
    }

    private async doQueryInternal(
        optionalQueryParams?: TQueryParams,
        changeLoading: boolean = true,
        handleErrors: boolean = true
    ) {
        this.onQueryStarted()

        let queryParams: TQueryParams
        if (optionalQueryParams) {
            queryParams = optionalQueryParams
        } else {
            queryParams = this.getCurrentQueryParams()
        }

        if (changeLoading) {
            this.onLoadingChange(true)
        }

        if (this.promise) {
            // If there is a pending request, abort it. We don't want the old results overwriting
            // newer results.
            this.promise.cancel()
        }

        this.promise = this.query(queryParams)
        let queryResult

        try {
            queryResult = await this.promise

            this.promise = undefined
            this.onResultReceived(queryResult)

            if (changeLoading) {
                this.onLoadingChange(false)
            }
        } catch (e) {
            if (handleErrors) {
                this.onError(e)
            } else {
                throw e
            }
        }
    }

    doQueryAsync = async (changeLoading: boolean = true) => {
        await this.doQueryInternal(undefined, changeLoading, false)
    }

    doQuery = (changeLoading: boolean = true) => {
        this.doQueryInternal(undefined, changeLoading)
    }

    handleQueryParamsChange(
        queryParams: TQueryParams,
        shouldDebounce: boolean,
        changeLoading?: boolean
    ) {
        if (shouldDebounce) {
            this.doQueryDebounced(changeLoading)
        } else {
            this.doQueryInternal(queryParams, changeLoading)
        }
    }

    dispose() {
        if (this.promise) this.promise.cancel()

        this.doQueryDebounced.cancel()
    }
}
