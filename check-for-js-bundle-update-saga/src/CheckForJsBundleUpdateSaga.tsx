import React from 'react'
import $ from 'jquery'
import moment from 'moment-timezone'
import { SagaIterator } from 'redux-saga'
import { delay, call } from 'redux-saga/effects'
import { alert } from '@interface-technologies/iti-react'

const hashElementId = 'js-bundle-hash'
const defaultDelayDuration = moment.duration(4, 'minutes')
const forceRefreshAfterAlertCount = 3

export function getIndexHtml(): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return Promise.resolve($.get('/'))
}

export function reload(): void {
    window.location.reload()
}

interface Options {
    delayDuration?: moment.Duration
    onError(e: unknown): void
}

export function* checkForJsBundleUpdateSaga({
    delayDuration = defaultDelayDuration,
    onError,
}: Options): SagaIterator<void> {
    const jsBundleHash = document.getElementById(hashElementId)?.innerText?.trim()

    if (!jsBundleHash) {
        onError(new Error('Could not get jsBundleHash.'))
        return
    }

    yield delay(delayDuration.asMilliseconds())

    let alertShownCount = 0

    for (;;) {
        try {
            const indexHtml = (yield call(getIndexHtml)) as string
            const indexJQuery = $(indexHtml)
            const selector = `#${hashElementId}`

            // No idea why find works for some documents and filter works for others
            let hashEl = indexJQuery.find(selector)
            if (hashEl.length === 0) hashEl = indexJQuery.filter(selector)
            if (hashEl.length === 0)
                onError(new Error('Could not get jsBundleHash in fetched document.'))

            const newJsBundleHash = hashEl.text().trim()

            if (jsBundleHash !== newJsBundleHash) {
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
                alertShownCount++
            }
        } catch (e) {
            onError(e)
        }

        yield delay(delayDuration.asMilliseconds())
    }
}
