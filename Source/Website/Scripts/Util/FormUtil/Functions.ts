import * as $ from 'jquery';

import { safeFetchRaw as safeFetch, safeFetch as fetchJson } from 'Util/AjaxUtil';

export async function submitFormAjaxRaw(form: JQuery, url: string): Promise<Response> {
    const headers = new Headers()
    headers.append('__RequestVerificationToken', $('input[name=__RequestVerificationToken]').val() as string)
    headers.append('content-type', 'application/x-www-form-urlencoded; charset=utf-8')

    return await safeFetch(url, {
        method: 'POST',
        body: form.serialize(),
        cache: 'no-cache',
        headers: headers,
    })
}

export async function submitFormAjax<T>(form: JQuery, url: string): Promise<T> {
    const response = await submitFormAjaxRaw(form, url)
    return await response.json() as T
}


// from Underscore.js
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function debounce(func: any, wait: any, immediate?: any) {
    var timeout: any
    return function (this: any) {
        var context = this, args = arguments
        var later = function () {
            timeout = null
            if (!immediate) func.apply(context, args)
        }
        var callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func.apply(context, args)
    }
};