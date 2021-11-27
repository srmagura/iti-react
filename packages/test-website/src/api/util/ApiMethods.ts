import { CancellablePromise } from 'real-cancellable-promise'

export type ConvertableToUrlParamValue =
    | string
    | number
    | boolean
    | undefined
    | null
    | moment.Moment

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
