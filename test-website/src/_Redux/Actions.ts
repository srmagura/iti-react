﻿import { ActionType } from 'typesafe-actions'
import { authActions } from '_Redux/Auth/AuthActions'
import { errorActions } from '_Redux/Error/ErrorState'

export const actions = {
    auth: authActions,
    error: errorActions
}

export type ItiAction = ActionType<typeof actions>
