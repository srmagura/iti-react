import { hasIErrorProperties, IError } from '@interface-technologies/iti-react'
import { Cancellation } from 'real-cancellable-promise'
import { ErrorType } from './ErrorType'
import { checkForJavaScriptError } from './errorUtil'

// Takes whatever object was thrown and turns it into an IError
export function processError(e: unknown): IError<ErrorType> {
    if (hasIErrorProperties<ErrorType>(e)) {
        return new IError<ErrorType>(e)
    }

    if (e instanceof Cancellation) {
        // We canceled the request for some reason. This doesn't need to be
        // reported to the user.
        return new IError<ErrorType>({
            type: ErrorType.CanceledPromise,
            message: 'The request to the server was canceled.',
        })
    }

    const jsError = checkForJavaScriptError(e)
    if (jsError) return jsError

    return new IError<ErrorType>({
        type: ErrorType.UnknownError,
        message: 'There was an unknown error.',
        handled: false,
    })
}

export function isConnectionError(e: unknown): boolean {
    return processError(e).type === ErrorType.ConnectionError
}
