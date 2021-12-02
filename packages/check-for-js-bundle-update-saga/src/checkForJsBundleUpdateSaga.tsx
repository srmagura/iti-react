import moment from 'moment-timezone'
import { SagaIterator } from 'redux-saga'
import { delay, call } from 'redux-saga/effects'
import { alert } from '@interface-technologies/iti-react'

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

function getBundleSrcFromDocument(
    doc: Document,
    bundleSrcPattern: RegExp
): string | undefined {
    const scripts = Array.from(doc.getElementsByTagName('script'))

    for (const script of scripts) {
        const parts = script.src?.split('/')
        if (parts.length === 0) continue

        const src = parts[parts.length - 1]
        if (bundleSrcPattern.test(src)) return src
    }

    return undefined
}

export interface CheckForJsBundleUpdateSagaOptions {
    delayDuration?: moment.Duration
    onError(e: unknown): void
    bundleSrcPattern?: RegExp
}

/**
 * Periodically fetches `/` (`index.html`) to check if a new JavaScript bundle has been
 * released.
 *
 * If the bundle has been updated, the user is prompted to refresh the page.
 * After 3 alerts are shown, the page is forcibly refreshed.
 *
 * Don't enable this in development!
 *
 * Your `index.html` must contain a script tag like:
 *
 * ```html
 * <script src="app.23e590a23b49.js"></script>
 * ```
 *
 * or
 *
 * ```html
 * <script src="dist/app.js?v=Gq0JHtehvL9fMpV"></script>
 * ```
 *
 * `checkForJsBundleUpdateSaga` will compare the `src` attribute of the script tag.
 *
 * An example of using `checkForJsBundleUpdateSaga` from your TypeScript code:
 *
 * ```
 * export function* myCheckForJsBundleUpdateSaga(): SagaIterator<void> {
 *     if (process.env.NODE_ENV === 'development') return
 *
 *     function onError(e: unknown): void {
 *         console.error(e)
 *         Bugsnag.notify(e)
 *     }
 *
 *     yield call(checkForJsBundleUpdateSaga, { onError })
 * }
 * ```
 */
export function* checkForJsBundleUpdateSaga({
    delayDuration = defaultDelayDuration,
    onError,
    bundleSrcPattern = /app\.\S+\.js/,
}: CheckForJsBundleUpdateSagaOptions): SagaIterator<void> {
    const bundleSrc = getBundleSrcFromDocument(document, bundleSrcPattern)

    if (!bundleSrc) {
        onError(new Error('Could not get bundle src from current document.'))
        return
    }

    yield delay(delayDuration.asMilliseconds())

    let alertShownCount = 0

    for (;;) {
        try {
            const indexHtml = (yield call(getIndexHtml)) as string | undefined
            if (indexHtml) {
                const retrievedDocument = new DOMParser().parseFromString(
                    indexHtml,
                    'text/html'
                )

                const retrievedBundleSrc = getBundleSrcFromDocument(
                    retrievedDocument,
                    bundleSrcPattern
                )
                if (!retrievedBundleSrc) {
                    onError('Could not get bundle src from retrieved document.')
                    return
                }

                if (bundleSrc !== retrievedBundleSrc) {
                    const content = (
                        <div>
                            <p>Please save your work and refresh the page.</p>
                            <p className="mb-0">
                                You may encounter errors if you do not refresh the page.
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
            }
        } catch (e) {
            onError(e)
        }

        yield delay(delayDuration.asMilliseconds())
    }
}
