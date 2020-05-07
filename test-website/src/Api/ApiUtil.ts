import $ from 'jquery'
import { CancellablePromise, formatUrlParams } from '@interface-technologies/iti-react'
import * as Cookies from 'js-cookie'
import { accessTokenCookieName } from 'Components'
import { isEqual } from 'lodash'
import { EmailAddressTypeName, EmailAddress } from 'Models'

export function getAccessToken() {
    return Cookies.get(accessTokenCookieName)
}

export function isAuthenticated() {
    return !!getAccessToken()
}

export function onlyIfAuthenticated<T>(
    func: () => CancellablePromise<T>
): CancellablePromise<T | undefined> {
    if (isAuthenticated()) {
        return func()
    }

    return CancellablePromise.resolve(undefined)
}

export function xhrToCancellablePromise<T>(xhr: JQuery.jqXHR): CancellablePromise<T> {
    // convert the custom JQuery promise to standard promise for compatibility with redux-saga
    const promise = Promise.resolve(xhr)

    return new CancellablePromise(promise, xhr.abort)
}

export function getAjaxOptions() {
    const accessToken = getAccessToken()

    let headers = {}
    if (accessToken != null) {
        headers = {
            Authorization: 'Bearer ' + accessToken,
        }
    }

    return { headers }
}

function replaceUrlParam(param: any): any {
    if (param) {
        if (Array.isArray(param)) {
            return param.map(replaceUrlParam)
        }

        const keys = Object.keys(param).filter((k) => k !== 'typeName')

        if (isEqual(keys, ['guid'])) {
            // value = ID
            return param.guid
        }

        switch (param.typeName) {
            case EmailAddressTypeName:
                return (param as EmailAddress).value
        }
    }

    return param
}

export function get<T>(url: string, urlParams: { [key: string]: any }) {
    for (const key of Object.keys(urlParams)) {
        urlParams[key] = replaceUrlParam(urlParams[key])
    }

    return xhrToCancellablePromise<T>(
        $.get({
            url: url + formatUrlParams(urlParams),
            dataType: 'json',
            ...getAjaxOptions(),
        })
    )
}

export function jsonStringifyReplacer(k: string, v: any) {
    if (v) {
        if (v._isAMomentObject) {
            return v.toISOString()
        }
    }

    return v
}

export function postCore<T>(url: string, data: any, dataType: string | undefined) {
    return xhrToCancellablePromise<T>(
        $.post({
            url,
            data: JSON.stringify(data, jsonStringifyReplacer),
            dataType,
            contentType: 'application/json',
            ...getAjaxOptions(),
        })
    )
}

export function post<T>(url: string, data: any) {
    return postCore<T>(url, data, 'json')
}

export function postVoid(url: string, data: any) {
    return postCore<void>(url, data, undefined)
}
