import { ErrorDto } from 'models'
import { ErrorType } from './ErrorType'

export function tryParseErrorDto(
    responseText: string | null | undefined
): ErrorDto | undefined {
    try {
        const obj = JSON.parse(responseText as any)

        if (
            obj.hasOwnProperty('message') &&
            obj.hasOwnProperty('diagnosticInfo') &&
            obj.hasOwnProperty('type')
        ) {
            return obj as ErrorDto
        }
    } catch (e1) {
        // response body could be empty depending on the exact nature of the error.
        // The backend *should* always respond with ErrorDto JSON when an error
        // occurs on the server.
    }
}

export function checkForJavaScriptError(e: any) {
    if (e && e.message && e.stack) {
        let diagnosticInfo = `Message: ${  e.message}`
        diagnosticInfo += '\n\n'
        diagnosticInfo += `Stacktrace: ${  e.stack}`

        return {
            type: ErrorType.JavaScriptError,
            message:
                'There was a client-side error. Please contact support if the problem persists.',
            diagnosticInfo,
            handled: false,
        }
    }

    return undefined
}
