import { CancellablePromise } from 'real-cancellable-promise'
import { Identity } from 'models'

export type UrlParamValue = string | number | boolean | undefined | null

export type ConvertableToUrlParamValue = UrlParamValue | Identity | moment.Moment

export type UrlParamsObject = {
    [key: string]: UrlParamValue
}

export type ConvertableToUrlParamsObject = {
    [key: string]: ConvertableToUrlParamValue
}

export interface ApiMethods {
    get: <T>(
        url: string,
        urlParams: ConvertableToUrlParamsObject,
        organizationToken?: string
    ) => CancellablePromise<T>

    post: <T>(
        url: string,
        data: Record<string, unknown>,
        organizationToken?: string
    ) => CancellablePromise<T>
}
