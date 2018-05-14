import { ErrorDto } from 'Models';

export enum ErrorType {
    CancelledAjaxRequest,
    IntervalServerError,
    BackendUnreachable,
    UnknownAjaxError,
    UnknownError,
    Unauthorized,
}

export interface IError {
    message: string
    type: ErrorType
    diagnosticInformation?: string
}

// Takes whatever object was thrown and turns into an ErrorDto
export function processError(e: any): IError {
    if (e.getAllResponseHeaders) {
        const xhr = e as JQuery.jqXHR

        if (xhr.statusText === 'abort') {
            // We cancelled the request for some reason. This isn't a real error.
            return {
                type: ErrorType.CancelledAjaxRequest,
                message: 'The request to the server was cancelled.'
            }
        }

        if (xhr.status === 401) {
            return {
                type: ErrorType.Unauthorized,
                message: 'You are not authorized to access this resource.'
            }
        }

        if (xhr.status === 500) {
            const errorDto = JSON.parse(xhr.responseText) as ErrorDto

            return {
                ...errorDto,
                type: ErrorType.IntervalServerError
            }
        }

        if (xhr.readyState === 0) {
            return {
                type: ErrorType.BackendUnreachable,
                message: 'Could not contact the server. Please refresh the page and try again.',
            }
        }

        return {
            type: ErrorType.UnknownAjaxError,
            message: 'An unknown error occurred while trying to contact the server. Refreshing the page might help.',
        }
    }

    return {
        type: ErrorType.UnknownError,
        message: 'There was an unknown error.' 
    }
}

export function isCancelledQuery(e: any) {
    return processError(e).type === ErrorType.CancelledAjaxRequest
}