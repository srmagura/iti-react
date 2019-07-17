import { takeEvery } from 'redux-saga/effects'
import { ItiAction } from '_Redux/Actions'
import { getErrorFromAction } from '_Redux/Error'
import { api } from 'Api'

export function* errorSaga() {
    yield takeEvery('*', logError)
}

function logError(action: ItiAction) {
    const error = getErrorFromAction(action)
    if (!error) return

    console.error(error)

    const userAgent = window.navigator.userAgent

    // remove error URL param
    const url = window.location.href.replace(/\??error=/i, '')

    const logMsg = JSON.stringify({
        errorType: error.type,
        message: error.message,
        url,
        userAgent,
        diagnosticInfo: error.diagnosticInfo
    })

    // no await - fire & forget
    api.log.warning({ message: logMsg })
}
