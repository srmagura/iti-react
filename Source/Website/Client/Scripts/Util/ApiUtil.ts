import * as $ from 'jquery';
import { formatUrlParams } from 'Util/UrlUtil';
import { ICancellablePromise} from 'Util/ValidationLib';


// Strongly-typed wrapper for jQuery XHR
export function as<T>(xhr: JQuery.jqXHR): ICancellablePromise<T> {
    return { cancel: xhr.abort, then: xhr.then }
}

export function getAjaxOptions() {
    return {
        headers: {
        },
    }
}

export function get<T>(url: string) {
    return as<T>($.get({
        url,
        dataType: 'json',
        ...getAjaxOptions()
    }))
}

export function postCore<T>(url: string, data: any, dataType: string | undefined) {
    return as<T>($.post({
        url,
        data: JSON.stringify(data),
        dataType,
        contentType: 'application/json',
        ...getAjaxOptions(),
    }))
}

export function post<T>(url: string, data: any) {
    return postCore<T>(url, data, 'json')
}
