import { UserDto } from 'models'
import { nullToUndefined } from '@interface-technologies/iti-react'
import { RequestStatus } from '_Redux/Common/RequestStatus'
import { AppState } from '../AppState'

export function selectUser(state: AppState): UserDto | undefined {
    return nullToUndefined(state.auth.user)
}

export const authSelectors = {
    logInRequestStatus: (state: AppState): RequestStatus => state.auth.logInRequestStatus,

    initialUserLoadInProgress: (state: AppState): boolean =>
        state.auth.meRequestStatus.inProgress &&
        !state.auth.logInRequestStatus.inProgress,
}
