import { UserDto } from 'Models'
import { AppState } from '../AppState'
import { nullToUndefined } from '@interface-technologies/iti-react'
import { RequestStatus } from '_Redux/Common/RequestStatus'

export function userSelector(state: AppState): UserDto | undefined {
    return nullToUndefined(state.auth.user)
}

export const authSelectors = {
    logInRequestStatus: (state: AppState): RequestStatus => state.auth.logInRequestStatus,
}
