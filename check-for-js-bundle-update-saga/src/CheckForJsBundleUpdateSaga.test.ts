import moment from 'moment-timezone'
import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga/effects'
import { alert } from '@interface-technologies/iti-react'
import {
    getIndexHtml,
    checkForJsBundleUpdateSaga,
    reload,
} from './CheckForJsBundleUpdateSaga'

jest.mock('@interface-technologies/iti-react')

// Mock window.location.reload since it not implemented in jsdom
// eslint-disable-next-line
delete (window as any).location
window.location = { reload: jest.fn() } as unknown as Location

const jsBundleHash = 'hash0'
const newJsBundleHash = 'hash1'

beforeEach(() => {
    jest.resetAllMocks()

    const jsBundleHashElement = document.createElement('span')
    jsBundleHashElement.innerText = jsBundleHash
    jsBundleHashElement.id = 'jsBundleHash'
    document.body.appendChild(jsBundleHashElement)
})

function getHtml(hash: string): string {
    return `
<html>
<head></head>
<body>
    <span id="jsBundleHash">${hash}</span>
</body>
</html>
`
}

const delayDuration = moment.duration(0, 'seconds')

it('does not show alert if hash matches', async () => {
    const onError = jest.fn()

    await expectSaga(checkForJsBundleUpdateSaga, { delayDuration, onError })
        .provide([[call(getIndexHtml), getHtml(jsBundleHash)]])
        .not.call.fn(alert)
        .not.call.fn(reload)
        .silentRun()

    expect(onError).not.toHaveBeenCalled()
})

it('does not call onError if getIndexHtml returns undefined', async () => {
    const onError = jest.fn()

    await expectSaga(checkForJsBundleUpdateSaga, { delayDuration, onError })
        .provide([[call(getIndexHtml), undefined]])
        .not.call.fn(alert)
        .not.call.fn(reload)
        .silentRun()

    expect(onError).not.toHaveBeenCalled()
})

it('shows alert several times and then refreshes page', async () => {
    const onError = jest.fn((e) => console.error(e))

    await expectSaga(checkForJsBundleUpdateSaga, { delayDuration, onError })
        .provide([[call(getIndexHtml), getHtml(newJsBundleHash)]])
        .call.fn(alert)
        .call.fn(alert)
        .call.fn(alert)
        .call(reload)
        .run()

    expect(onError).not.toHaveBeenCalled()
    expect(window.location.reload).toHaveBeenCalled()
})
