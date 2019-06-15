import { ActionType, createStandardAction } from 'typesafe-actions'
import { UserDto } from 'Models'

export const actions = {
    setUser: createStandardAction('SET_USER')<UserDto | null>()
}

export type ItiAction = ActionType<typeof actions>
