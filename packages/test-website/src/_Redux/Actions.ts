import { ActionType } from 'typesafe-actions'
import { authActions } from '_Redux/Auth/AuthActions'
import { onError } from '_Redux/Error/ErrorActions'

export const actions = {
    auth: authActions,
    onError,
}

export type TestWebsiteAction = ActionType<typeof actions>
