import { configureStore, isPlain } from '@reduxjs/toolkit'
import moment from 'moment-timezone'
import { Store } from 'redux'
import createSagaMiddleware, { Task } from 'redux-saga'
import { AppState } from './AppState'
import { rootReducer } from './rootReducer'
import { rootSaga } from './rootSaga'

function isSerializable(value: unknown): boolean {
    // We allow moment and Error objects in the store for convenience and to
    // enable Bugsnag integration, even though these objects are not technically
    // serializable. This shouldn't cause any problems as long as the objects
    // are not mutated.
    return isPlain(value) || value instanceof Error || moment.isMoment(value)
}

export function configureTestWebsiteStore(): {
    store: Store<AppState>
    runSideEffects(): Task
} {
    const sagaMiddleware = createSagaMiddleware()

    const store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({ serializableCheck: { isSerializable } }).concat(
                sagaMiddleware
            ),
    })

    function runSideEffects(): Task {
        return sagaMiddleware.run(rootSaga)
    }

    return { store, runSideEffects }
}
