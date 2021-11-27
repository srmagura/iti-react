import { CancellablePromise } from 'real-cancellable-promise'

export type UrlParamValue = string | number | boolean | undefined | null

export type ConvertableToUrlParamValue = UrlParamValue | moment.Moment

export type UrlParamsObject = {
    [key: string]: UrlParamValue
}

export type ConvertableToUrlParamsObject = {
    [key: string]: ConvertableToUrlParamValue
}

export interface ApiMethods {
    get: <T>(
        url: string,
        urlParams: ConvertableToUrlParamsObject
    ) => CancellablePromise<T>

    post: <T>(url: string, data: Record<string, unknown>) => CancellablePromise<T>
}
