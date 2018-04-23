import { ErrorDto } from 'Models';

// Takes whatever object was thrown and turns into an ErrorDto
export function processError(e: any): ErrorDto | undefined {
    if (e.getAllResponseHeaders) {
        const xhr = e as JQuery.jqXHR

        if (xhr.statusText === 'abort') {
            // We cancelled the request for some reason. This isn't a real error.
            return undefined
        }

        if (xhr.status === 500) {
            return JSON.parse(xhr.responseText) as ErrorDto
        }

        if (xhr.readyState === 0) {
            return {
                message: 'Could not contact the server. Please refresh the page and try again.',
                diagnosticInformation: undefined
            }
        }

        return {
            message: 'An unknown error occurred while trying to contact the server. Refreshing the page might help.',
            diagnosticInformation: undefined
        }
    }
}