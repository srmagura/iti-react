import { SagaIterator } from '@redux-saga/types'
import { fork } from 'redux-saga/effects'
import { authSaga } from '_redux/auth/authSagas'

export function* rootSaga(): SagaIterator<void> {
    yield fork(authSaga)
}
