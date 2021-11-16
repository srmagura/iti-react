import { fork } from 'redux-saga/effects'
import { authSaga } from '_Redux/Auth/AuthSagas'
import { errorSaga } from '_Redux/Error/ErrorSagas'

export function* rootSaga() {
    yield fork(authSaga)
    yield fork(errorSaga)
}
