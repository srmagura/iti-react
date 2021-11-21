import { takeEvery } from 'redux-saga/effects'
import { TestWebsiteAction } from '_Redux/Actions'
import { getErrorFromAction } from '_Redux/Error'

export function* errorSaga() {
    yield takeEvery('*', logError)
}

function logError(action: TestWebsiteAction) {
    const error = getErrorFromAction(action)
    if (!error) return

    console.error(error)
}
