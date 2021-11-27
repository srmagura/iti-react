import { combineReducers, createAction, createReducer } from '@reduxjs/toolkit'
import { getRequestStatusReducer, RequestStatus } from '_Redux/Common'
import type { AppState } from '_Redux/AppState'
import { ErrorPayload } from '_Redux/Error'

export const authActions = {
    hasSavedAccessToken: createAction('auth/hasSavedAccessToken'),
    logInAsync: {
        request: createAction<{
            email: string
            password: string
            rememberMe: boolean
        }>('auth/logIn/request'),
        fulfilled: createAction('auth/logIn/fulfilled'),
        rejected: createAction<ErrorPayload>('auth/logIn/rejected'),
    },
    logOut: createAction('auth/logOut'),
}

const authenticatedReducer = createReducer<boolean>(false, (builder) => {
    builder.addCase(authActions.hasSavedAccessToken, () => true)
    builder.addCase(authActions.logInAsync.fulfilled, () => true)
})

export const authReducer = combineReducers({
    authenticated: authenticatedReducer,
    logInRequestStatus: getRequestStatusReducer(authActions.logInAsync),
})

export function selectAuthenticated(state: AppState): boolean {
    return state.auth.authenticated
}

export function selectLogInRequestStatus(state: AppState): RequestStatus {
    return state.auth.logInRequestStatus
}
