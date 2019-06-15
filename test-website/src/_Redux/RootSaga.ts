import { fork } from 'redux-saga/effects'
import { authSaga } from '_Redux/Auth/AuthSagas';

export function* rootSaga() {
    yield fork(authSaga)
}
