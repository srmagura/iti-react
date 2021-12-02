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

function getHashFromDocument(doc: Document, bundleName: string): string | undefined {
    const regExp = new RegExp(`${bundleName}\\.(\\S+)\\.js`)
    const scripts = Array.from(doc.getElementsByTagName('script'))

    for (const script of scripts) {
        const match = regExp.exec(script.src)
        if (match) return match[1]
    }

    return undefined
}

export interface CheckForJsBundleUpdateSagaOptions {
    delayDuration?: moment.Duration
    onError(e: unknown): void
    bundleName?: string
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
 * Your `index.html` must contain a script tag like:
 *
 * ```html
 * <script src="app.23e590a23b49.js"></script>
 * ```
 *
 * `checkForJsBundleUpdateSaga` will extract the hash from the script tag's `src`.
 *
 * And example of using `checkForJsBundleUpdateSaga` from your TypeScript code:
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
    bundleName = 'app',
}: CheckForJsBundleUpdateSagaOptions): SagaIterator<void> {
    const hash = getHashFromDocument(document, bundleName)

    if (!hash) {
        onError(new Error('Could not get js bundle hash from current document.'))
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
                retrievedDocument.getElementsByTagName('script')
                const newHash = getHashFromDocument(retrievedDocument, bundleName)
                if (!newHash) {
                    onError('Could not get js bundle hash from retrieved document.')
                    return
                }

                if (hash !== newHash) {
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
