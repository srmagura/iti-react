import { IError } from '@interface-technologies/iti-react'
import { ErrorType } from './ErrorType'

export const connectionErrorMessage =
    'Could not contact the server. Please refresh the page and try again.'

export const javaScriptErrorMessage =
    'There was a client-side error. Please contact support if the problem persists.'

export function checkForJavaScriptError(e: unknown): IError<ErrorType> | undefined {
    const error = e as Error | undefined
    if (error && error.message && error.stack) {
        let diagnosticInfo = `Message: ${error.message}`
        diagnosticInfo += '\n\n'
        diagnosticInfo += `Stacktrace: ${error.stack}`

        return new IError<ErrorType>({
            type: ErrorType.JavaScriptError,
            message: javaScriptErrorMessage,
            diagnosticInfo,
            handled: false,
        })
    }

    return undefined
}
