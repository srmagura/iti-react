function ajaxErrorHandler(message: string): void {
    alert(message)
}

// This is a convenience function with built in error handling. If you need fine-grained control over
// error handling just call fetch directly.
export async function safeFetchRaw(input: RequestInfo, init?: RequestInit | undefined): Promise<Response> {
    let response: Response

    try {
        response = await fetch(input, init)
    } catch (e) {
        ajaxErrorHandler('Could not contact the server. Please refresh the page and try again.')
        throw new Error(`Network error occurred during AJAX call to ${input}.`)
    }

    if (!response.ok) {
        ajaxErrorHandler(`Received error status code ${response.statusText} from the server. Please try again.\n\n` +
            'If this issue persists, please contact us.')
        throw new Error(`Received status code ${response.status} during AJAX call to ${input}.`)
    }

    return response
}

export async function safeFetch<T>(input: RequestInfo, init?: RequestInit | undefined): Promise<T> {
    const response = await safeFetchRaw(input, init)
    return await response.json() as T
}