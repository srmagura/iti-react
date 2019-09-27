import { UserDto } from 'Models'
import { AppState } from '../AppState'
import { nullToUndefined } from '@interface-technologies/iti-react'

export function userSelector(state: AppState): UserDto | undefined {
    return nullToUndefined(state.auth.user)
}

export function requiredUserSelector(state: AppState): UserDto {
    const user = userSelector(state)
    if (!user) throw new Error('User is null or undefined.')

    return user
}
