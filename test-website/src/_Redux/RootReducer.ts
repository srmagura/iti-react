import { combineReducers } from 'redux'
import { ItiAction } from './Actions'
import { AppState } from './AppState'
import { authReducer } from '_Redux/Auth/AuthReducer'
import { errorReducer } from '_Redux/Error/ErrorState'

export const rootReducer = combineReducers<AppState, ItiAction>({
    auth: authReducer,
    error: errorReducer
    //routeSpecificState: (state = { current: {}}, action) => state
})
