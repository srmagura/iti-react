import { ErrorDto } from 'Models';
import * as BrowserUtil from 'Util/BrowserUtil';

// Add the X-Requested-With header to all fetch requests so that the server knows to return 
// any error messages as JSON.
if (BrowserUtil.isBrowser()) {
    const browserFetch = window.fetch

    window.fetch = async (input: RequestInfo, init?: RequestInit | undefined) => {
        if (typeof init === 'undefined')
            init = {}

        if (typeof init.headers === 'undefined')
            init.headers = new Headers()

        const headers = (init as RequestInit).headers as Headers
        headers.append('X-Requested-With', 'AJAX')

        return await browserFetch(input, init)
    }
}

function alertUser(message: string): void {
    alert(message)
}

// This is a convenience function with built in error handling. If you need fine-grained control over
// error handling just call fetch directly.
export async function safeFetchRaw(input: RequestInfo, init?: RequestInit | undefined): Promise<Response> {
    let response: Response

    try {
        response = await fetch(input, init)
    } catch (e) {
        alertUser('Could not contact the server. Please refresh the page and try again.')
        throw new Error(`Network error occurred during AJAX call to ${input}.`)
    }

    if (!response.ok) {
        if (response.status === 500) {
            const errorDto = await response.json() as ErrorDto
            console.error(`Error message: ${errorDto.message}`)
            console.error(errorDto.diagnosticInformation)

            alertUser(`There was an error processing your request: ${errorDto.message}`)
        } else {
            alertUser(
                `Received error status code ${response.statusText} from the server. Please try again.\n\n` +
                'If this issue persists, please contact us.')
        }

        throw new Error(`Received status code ${response.status} during AJAX call to ${input}.`)
    }

    return response
}

export async function safeFetch<T>(input: RequestInfo, init?: RequestInit | undefined): Promise<T> {
    const response = await safeFetchRaw(input, init)
    return await response.json() as T
}