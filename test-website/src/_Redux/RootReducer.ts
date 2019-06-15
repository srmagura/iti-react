import {  combineReducers,  } from 'redux'
import { ItiAction } from './Actions'
import { AppState } from './AppState'
import { authReducer } from '_Redux/Auth/AuthReducer';

export const rootReducer = combineReducers<AppState, ItiAction>({
    auth: authReducer,
    routeSpecificState: (state = { current: {}}, action) => state
})

