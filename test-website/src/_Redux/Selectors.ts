import { UserDto } from 'Models'
import { AppState } from './AppState'
import { nullToUndefined } from '@interface-technologies/iti-react'
import { IError } from '_Redux/Error/ErrorHandling'

export function userSelector(state: AppState): UserDto | undefined {
    return nullToUndefined(state.auth.user)
}

export function requiredUserSelector(state: AppState): UserDto {
    const user = userSelector(state)
    if (!user) throw new Error('User is null or undefined.')

    return user
}

export function errorSelector(state: AppState): IError | undefined {
    return nullToUndefined(state.error)
}
