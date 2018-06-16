import { debounce } from 'lodash'
import * as moment from 'moment'
import { ICancellablePromise } from '../CancellablePromise'

export interface IDataUpdater<TQueryParams, TResult> {
    doQuery(changeLoading?: boolean): void
    doQueryAsync(changeLoading?: boolean): Promise<void>

    handleQueryParamsChange(
        queryParams: TQueryParams,
        shouldDebounce: boolean
    ): void
    dispose(): void

    onQueryStarted: () => void
}

export interface IDataUpdaterOptions<TQueryParams, TResult> {
    getCurrentQueryParams: () => TQueryParams
    query: (queryParams: TQueryParams) => ICancellablePromise<TResult>

    // This is an option rather than a hard-coded function so that DataUpdater
    // does not have to know how the query is implemented (e.g. with jQuery.ajax).
    isCancelledQuery: (e: any) => boolean

    onLoadingChange: (loading: boolean) => void
    onResultReceived: (result: TResult) => void
    onError: (e: any) => void
}

export class DataUpdater<TQueryParams, TResult>
    implements IDataUpdater<TQueryParams, TResult> {
    private getCurrentQueryParams: () => TQueryParams
    private query: (queryParams: TQueryParams) => ICancellablePromise<TResult>
    private isCancelledQuery: (e: any) => boolean

    private onLoadingChange: (loading: boolean) => void
    private onResultReceived: (result: TResult) => void
    private onError: (e: any) => void

    private promise?: ICancellablePromise<TResult>

    onQueryStarted: () => void = () => {}

    constructor(options: IDataUpdaterOptions<TQueryParams, TResult>) {
        this.getCurrentQueryParams = options.getCurrentQueryParams
        this.query = options.query
        this.isCancelledQuery = options.isCancelledQuery

        this.onLoadingChange = options.onLoadingChange
        this.onResultReceived = options.onResultReceived
        this.onError = options.onError

        this.doQueryDebounced = debounce(this.doQueryInternal, 500)
    }

    private doQueryDebounced: () => void

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
        shouldDebounce: boolean
    ) {
        if (shouldDebounce) {
            this.doQueryDebounced()
        } else {
            this.doQueryInternal(queryParams)
        }
    }

    dispose() {
        if (this.promise) {
            this.promise.cancel()
        }
    }
}
