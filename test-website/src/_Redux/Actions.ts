import { ActionType } from 'typesafe-actions'
import { authActions } from '_Redux/Auth/AuthActions';

export const actions = {
    auth: authActions
}

export type ItiAction = ActionType<typeof actions>
