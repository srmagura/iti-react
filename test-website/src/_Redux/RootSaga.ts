import { fork } from 'redux-saga/effects'


export function* rootSaga() {
    yield fork(() => { })
    //yield fork(authSaga)
    //yield fork(orderSaga)
    //yield fork(offerSaga)
    //yield fork(vendorSaga)
    //yield fork(metadataSaga)
}
