import { Log } from 'Util/Plumbing/Log';
import * as BrowserUtil from 'Util/BrowserUtil';

let isDebug = false

export function setIsDebug(_isDebug: boolean) {
    isDebug = _isDebug
}

// Because React throws errors twice and we don't want to get two alerts
// See https://github.com/facebook/react/issues/10474
let alertShown = false

// Log any JavaScript errors
async function onError(message: string | Event, source?: string, lineno?: number, colno?: number, error?: Error) {
    // lineno and colno refer to the bundled & minified source

    const userAgent = window.navigator.userAgent
    const url = window.location.href
    const debugHelp = 'See Documentation/JSErrorLog.md'

    const logMsg = JSON.stringify({
        message,
        source,
        lineno,
        colno,
        error,
        userAgent,
        url,
        debugHelp
    })

    try {
        await Log.error(logMsg)
    } catch (e) {
        console.error(e)
    }

    if (isDebug && !alertShown) {
        alertShown = true
       alert('(Debug) Error: ' + message)
    }
}

export function setup() {
    if (BrowserUtil.isBrowser()) {
        window.onerror = onError
    }
}