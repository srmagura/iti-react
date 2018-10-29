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

    // This is an option rather than a hard-coded function so that DataUpdater
    // does not have to know how the query is implemented (e.g. with jQuery.ajax).
    isCancelledQuery: (e: any) => boolean

    onLoadingChange: (loading: boolean) => void
    onResultReceived: (result: TResult) => void
    onError: (e: any) => void
}

export class DataUpdater<TQueryParams, TResult> implements IDataUpdater<TQueryParams> {
    private readonly getCurrentQueryParams: () => TQueryParams
    private readonly query: (queryParams: TQueryParams) => CancellablePromise<TResult>
    private readonly isCancelledQuery: (e: any) => boolean

    private readonly onLoadingChange: (loading: boolean) => void
    private readonly onResultReceived: (result: TResult) => void
    private readonly onError: (e: any) => void

    private readonly doQueryDebounced: (changeLoading?: boolean) => void
    private promise?: CancellablePromise<TResult>

    onQueryStarted: () => void = () => {}

    constructor(options: DataUpdaterOptions<TQueryParams, TResult>) {
        this.getCurrentQueryParams = options.getCurrentQueryParams
        this.query = options.query
        this.isCancelledQuery = options.isCancelledQuery

        this.onLoadingChange = options.onLoadingChange
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

        let cancelled = false

        try {
            queryResult = await this.promise

            this.promise = undefined

            this.onResultReceived(queryResult)
        } catch (e) {
            // if we cancelled the query, this isn't a real error
            if (this.isCancelledQuery(e)) {
                cancelled = true
            } else {
                if (handleErrors) {
                    this.onError(e)
                } else {
                    throw e
                }
            }
        }

        if (changeLoading && !cancelled) {
            this.onLoadingChange(false)
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
        if (this.promise) {
            this.promise.cancel()
        }
    }
}
