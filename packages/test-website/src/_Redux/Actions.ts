import { ActionType } from 'typesafe-actions'
import { authActions } from '_Redux/Auth/AuthActions'
import { errorActions } from '_Redux/Error/ErrorActions'

export const actions = {
    auth: authActions,
    error: errorActions,
}

export type TestWebsiteAction = ActionType<typeof actions>
