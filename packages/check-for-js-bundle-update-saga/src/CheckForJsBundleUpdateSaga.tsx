import React from 'react'
import moment from 'moment-timezone'
import { SagaIterator } from 'redux-saga'
import { delay, call } from 'redux-saga/effects'
import { alert } from '@interface-technologies/iti-react'

const hashElementId = 'jsBundleHash'
const defaultDelayDuration = moment.duration(4, 'minutes')
const forceRefreshAfterAlertCount = 3

/** @internal */
export function getIndexHtml(): Promise<string | undefined> {
    return (
        fetch('/')
            .then((response) => {
                if (!response.ok) return undefined

                return response.text()
            })
            // If fetch throws a TypeError for some weird reason, also return undefined
            .catch(() => undefined)
    )
}

/** @internal */
export function reload(): void {
    window.location.reload()
}

export interface CheckForJsBundleUpdateSagaOptions {
    delayDuration?: moment.Duration
    onError(e: unknown): void
}

/**
 * Peridoically fetches `/` (`index.html`) to check if a new JavaScript bundle has been
 * released.
 *
 * If the bundle has been updated, the user is prompted to refresh the page.
 * After 3 alerts are shown, the page is forcibly refreshed.
 *
 * Don't enable this in development!
 *
 * Your `index.html` must contain a hidden element with the ID `jsBundleHash` that
 * contains a hash of the JavaScript bundle's entry point. Here's how to do this
 * in ASP.NET Core:
 *
 * ```razor
 * var path = $"dist/{bundleName}.js";
 * string jsBundleHash;
 *
 * using (var sha256 = SHA256.Create())
 * {
 *     var fullPath = System.IO.Path.Combine("wwwroot", path);
 *     using (var readStream = File.OpenRead(fullPath))
 *     {
 *         var hashBytes = sha256.ComputeHash(readStream);
 *         jsBundleHash = WebEncoders.Base64UrlEncode(hashBytes);
 *     }
 * }
 *
 * <script src=@path asp-append-version="true"></script>
 * <span id="jsBundleHash" style="display: none">
 *     @jsBundleHash
 * </span>
 * ```
 *
 * And example of using `checkForJsBundleUpdateSaga` from your TypeScript code:
 *
 * ```
 * export function* myCheckForJsBundleUpdateSaga(): SagaIterator<void> {
 *     if ((window as unknown as WindowWithGlobals).isDebug) return
 *
 *     function onError(e: unknown): void {
 *         console.error(e)
 *
 *         const ierror = processError(e)
 *
 *         // Never show the user an error because of this
 *         if (shouldLogError(ierror)) {
 *             Bugsnag.notify(ierror)
 *         }
 *     }
 *
 *     yield call(checkForJsBundleUpdateSaga, { onError })
 * }
 * ```
 */
export function* checkForJsBundleUpdateSaga({
    delayDuration = defaultDelayDuration,
    onError,
}: CheckForJsBundleUpdateSagaOptions): SagaIterator<void> {
    const jsBundleHash = document.getElementById(hashElementId)?.innerText?.trim()

    if (!jsBundleHash) {
        onError(new Error('Could not get jsBundleHash.'))
        return
    }

    yield delay(delayDuration.asMilliseconds())

    let alertShownCount = 0

    for (;;) {
        try {
            const indexHtml = (yield call(getIndexHtml)) as string | undefined
            if (indexHtml) {
                const document = new DOMParser().parseFromString(indexHtml, 'text/html')
                const hashEl = document.getElementById(hashElementId)

                if (hashEl) {
                    // innerText doesn't work here for some reason
                    const newJsBundleHash = hashEl.innerHTML?.trim()

                    if (jsBundleHash !== newJsBundleHash) {
                        const content = (
                            <div>
                                <p>Please save your work and refresh the page.</p>
                                <p className="mb-0">
                                    You may encounter errors if you do not refresh the
                                    page.
                                </p>
                            </div>
                        )

                        if (alertShownCount >= forceRefreshAfterAlertCount) {
                            window.onbeforeunload = null
                            yield call(reload)
                            return
                        }

                        yield call(alert, content, { title: 'Website Update Available!' })
                        alertShownCount += 1
                    }
                } else {
                    onError(new Error('Could not get jsBundleHash in fetched document.'))
                }
            }
        } catch (e) {
            onError(e)
        }

        yield delay(delayDuration.asMilliseconds())
    }
}
