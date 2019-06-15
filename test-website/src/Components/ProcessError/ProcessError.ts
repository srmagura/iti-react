import { tryParseErrorDto, checkForJavaScriptError } from './ErrorUtil'
import { IError } from './IError';
import { ErrorType } from './ErrorType';
import { mapFromErrorDtoType } from 'Components/ProcessError/MapFromErrorDtoType';


// Takes whatever object was thrown and turns into an IError
export function processError(e: any): IError {
    if (e.hasOwnProperty('message') && e.hasOwnProperty('type') && !e.hasOwnProperty('typeName')) {
        return e as IError
    }

    if (e && e.getAllResponseHeaders) {
        const xhr = e as JQuery.jqXHR

        if (xhr.statusText === 'abort') {
            // We canceled the request for some reason. This doesn't need to be
            // reported to the user.
            return {
                type: ErrorType.CanceledAjaxRequest,
                message: 'The request to the server was canceled.'
            }
        }

        if (xhr.status === 401) {
            return {
                type: ErrorType.NotAuthenticated,
                message: 'You must be authenticated to access this resource.'
            }
        }

        const errorDto = tryParseErrorDto(e.responseText)
        if (errorDto) {
            return {
                type: mapFromErrorDtoType(errorDto.type),
                message: errorDto.message,
                diagnosticInfo: errorDto.diagnosticInfo
            }
        }
        

        if (xhr.readyState === 0) {
            return {
                type: ErrorType.ConnectionError,
                message:
                    'Could not contact the server. Please refresh the page and try again.'
            }
        }

        return {
            type: ErrorType.UnknownAjaxError,
            message:
                'An unknown error occurred while trying to contact the server. Refreshing the page might help.'
        }
    }

    const jsError = checkForJavaScriptError(e)
    if (jsError) return jsError

    return {
        type: ErrorType.UnknownError,
        message: 'There was an unknown error.'
    }
}

export function isConnectionError(e: any): boolean {
    return processError(e).type === ErrorType.ConnectionError
}
