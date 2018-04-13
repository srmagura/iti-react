import * as $ from 'jquery';

// TODO update from HpsPortal
export function ajaxErrorHandler(data: any): void {
    let consoleMessage = 'AJAX error diagnostic information: '
    consoleMessage += JSON.stringify(data)
    console.log(consoleMessage)

    let message = 'Error talking to the server. Reloading the page might help.'
    alert(message)
}

const ajaxNetworkError = 'AJAX network error'
const ajaxHttpStatusCodeError = 'AJAX HTTP status code error'

function createError(type: string, message: string) {
    return new Error(`${type}: ${message}`)
}

async function fetchJson<T>(input: RequestInfo, init?: RequestInit | undefined): Promise<T> {
    let response: Response

    try {
        response = await fetch(input, init)
    } catch(e) {
        throw createError(ajaxNetworkError + ': ' + )
    }

    if (!response.ok) {
       
       // throw new Error('')
    }

    return await response.json() as T
}

export async function submitFormAjax<T>(form: JQuery, url: string): Promise<T> {
    const headers = new Headers()
    headers.append('__RequestVerificationToken', $('input[name=__RequestVerificationToken]').val() as string)
    headers.append('content-type', 'application/x-www-form-urlencoded; charset=utf-8')

    return await fetchJson<T>(url, {
        method: 'POST',
        body: form.serialize(),
        cache: 'no-cache',
        headers: headers,
    })
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