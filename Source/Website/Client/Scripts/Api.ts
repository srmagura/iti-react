import * as $ from 'jquery';
import { ProductDto } from 'Models'
import { formatUrlParams } from 'Util/UrlUtil';

export interface CancellablePromise<T> {
    cancel(): void
    then(success: (result: T) => void, failure: (error: any) => void): void
}

// Strongly-typed wrapper for jQuery XHR
function as<T>(xhr: JQuery.jqXHR): CancellablePromise<T> {
    return { cancel: xhr.abort, then: xhr.then }
}

export const api = {
    product: {
        list: () =>
            as<ProductDto[]>($.getJSON('api/product/list')),
        get: (id: number) => {
            const qs = formatUrlParams({ id })
            return as<ProductDto>($.getJSON('api/product/get' + qs))
        },
        internalServerError: () =>
            as<void>($.get('api/product/internalServerError'))
    }
}