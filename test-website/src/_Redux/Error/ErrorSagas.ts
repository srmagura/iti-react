import { takeEvery } from 'redux-saga/effects'
import { ItiAction } from '_Redux/Actions'
import { getErrorFromAction } from '_Redux/Error'

export function* errorSaga() {
    yield takeEvery('*', logError)
}

function logError(action: ItiAction) {
    const error = getErrorFromAction(action)
    if (!error) return

    console.error(error)
}
