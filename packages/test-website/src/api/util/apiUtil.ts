import { IError } from '@interface-technologies/iti-react'
import Cookies from 'js-cookie'
import { accessTokenCookieName } from '_constants'
import { isMoment } from 'moment-timezone'
import { CancellablePromise, Cancellation } from 'real-cancellable-promise'
import { connectionErrorMessage, ErrorType } from '_util/errorHandling'
import { prepareUrlParamsForSerialization } from './prepareUrlParamsForSerialization'
import { ConvertableToUrlParamsObject } from './ApiMethods'

function getAccessToken(): string | undefined {
    return Cookies.get(accessTokenCookieName)
}

export function isAuthenticated(): boolean {
    return !!getAccessToken()
}

function getErrorFromFetchResponse(response: Response): IError<ErrorType> {
    if (response.status === 400) {
        return new IError<ErrorType>({
            type: ErrorType.BadRequest,
            message: 'The request was invalid.',
        })
    }

    if (response.status === 401) {
        return new IError<ErrorType>({
            type: ErrorType.NotAuthenticated,
            message: 'You must be authenticated to access this resource.',
        })
    }

    if (response.status >= 400) {
        return new IError<ErrorType>({
            type: ErrorType.ErrorHttpStatusCode,
            message: 'The server encountered an error.',
            diagnosticInfo: `HTTP status code was ${response.status}.`,
        })
    }

    return new IError<ErrorType>({
        type: ErrorType.UnknownRequestError,
        message:
            'An unknown error occurred while trying to contact the server. Refreshing the page might help.',
    })
}

export function cancellableFetch(
    input: RequestInfo,
    init: RequestInit = {}
): CancellablePromise<unknown> {
    const controller = new AbortController()

    const fetchPromise = fetch(input, {
        ...init,
        signal: controller.signal,
    })

    const timeoutPromise = new Promise<Response>((resolve, reject) => {
        setTimeout(() => reject(new Error('timeout')), 120 * 1000)
    })

    const promise = CancellablePromise.race([fetchPromise, timeoutPromise])
        .then((response) => {
            if (!response.ok) throw getErrorFromFetchResponse(response)

            if (response.headers.get('content-type')?.includes('application/json')) {
                // This can also throw an AbortError
                return response.json()
            }

            return undefined
        })
        .catch((e) => {
            if (e instanceof IError) throw e

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (e.message === 'timeout') {
                throw new IError<ErrorType>({
                    type: ErrorType.ConnectionError,
                    message: connectionErrorMessage,
                })
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (e.name === 'AbortError') {
                throw new Cancellation()
            }

            throw new IError<ErrorType>({
                type: ErrorType.ConnectionError,
                message: connectionErrorMessage,
            })
        })

    return new CancellablePromise(promise, () => controller.abort())
}

export function getHeaders(options: { contentType: string | undefined }): {
    [key: string]: string
} {
    const headers: { [key: string]: string } = {}

    const accessToken = getAccessToken()
    if (accessToken != null) headers.Authorization = `Bearer ${accessToken}`
    if (options.contentType) headers['Content-Type'] = options.contentType

    return headers
}

export function get<T>(
    url: string,
    urlParams: ConvertableToUrlParamsObject
): CancellablePromise<T> {
    const stringUrlParams = prepareUrlParamsForSerialization(urlParams)

    return cancellableFetch(`${url}?${new URLSearchParams(stringUrlParams).toString()}`, {
        headers: getHeaders({ contentType: undefined }),
    }) as CancellablePromise<T>
}

function jsonStringifyReplacer(_k: string, v: unknown): unknown {
    if (v) {
        if (isMoment(v)) {
            return v.toISOString()
        }
    }

    return v
}

export function post<T>(url: string, data: unknown): CancellablePromise<T> {
    return cancellableFetch(url, {
        method: 'POST',
        headers: getHeaders({ contentType: 'application/json' }),
        body: JSON.stringify(data, jsonStringifyReplacer),
    }) as CancellablePromise<T>
}
