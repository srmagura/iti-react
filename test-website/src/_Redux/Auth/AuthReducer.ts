import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { ItiAction, actions } from '_Redux/Actions'
import {
    getRequestStatusReducerRaw,
    getRequestStatusReducer
} from '_Redux/Common/GetRequestStatusReducer'
import { UserDto } from 'Models'
import { RequestStatus } from '_Redux/Common/RequestStatus'

export interface AuthState {
    readonly user: UserDto | null

    readonly logInRequestStatus: RequestStatus
    readonly meRequestStatus: RequestStatus
}

export const authReducer = combineReducers<AuthState, ItiAction>({
    user: (state = null, action) => {
        switch (action.type) {
            case getType(actions.auth.meAsync.success):
                return action.payload
            case getType(actions.auth.logOut):
                return null
        }
        return state
    },
    logInRequestStatus: getRequestStatusReducerRaw({
        requestActions: [actions.auth.logInAsync.request],
        successActions: [actions.auth.meAsync.success], // Wait until user loaded
        failureActions: [actions.auth.logInAsync.failure, actions.auth.meAsync.failure]
    }),
    meRequestStatus: getRequestStatusReducer(actions.auth.meAsync)
})
