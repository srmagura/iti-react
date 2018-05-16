import * as $ from 'jquery';
import * as moment from 'moment';
import { formatUrlParams } from 'Util/UrlUtil';
import { ICancellablePromise, cancellableThen, cancellableResolve } from 'Util/ITIReact';

export function onlyIfAuthenticated<T>(func: () => ICancellablePromise<T>): ICancellablePromise<T | undefined> {
    return func()
    // TODO

    //if (isAuthenticated()) {
    //    return func()
    //}

    //return cancellableResolve(undefined)
}

// Strongly-typed wrapper for jQuery XHR
export function xhrToCancellablePromise<T>(xhr: JQuery.jqXHR): ICancellablePromise<T> {
    return { cancel: xhr.abort, then: xhr.then }
}

export function getAjaxOptions() {
    return { }
}

export function get<T>(url: string, urlParams: object) {
    return xhrToCancellablePromise<T>($.get({
        url: url + formatUrlParams(urlParams),
        dataType: 'json',
        ...getAjaxOptions()
    }))
}

function replacer(k: string, v: any) {
    if (v && v._isAMomentObject) {
        return v.toISOString()
    }

    return v
}

export function postCore<T>(url: string, data: any, dataType: string | undefined) {
    return xhrToCancellablePromise<T>($.post({
        url,
        data: JSON.stringify(data, replacer),
        dataType,
        contentType: 'application/json',
        ...getAjaxOptions(),
    }))
}

export function post<T>(url: string, data: any) {
    return postCore<T>(url, data, 'json')
}

export function postVoid(url: string, data: any) {
    return postCore<void>(url, data, undefined)
}
