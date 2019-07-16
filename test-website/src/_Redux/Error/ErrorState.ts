import { getType, createStandardAction } from 'typesafe-actions'
import { ItiAction, actions } from '_Redux/Actions'
import { IError, processError, ErrorType, isIError } from './ErrorHandling'

export const errorActions = {
    onError: createStandardAction('ON_ERROR')<any>(),
    clearError: createStandardAction('CLEAR_ERROR')()
}

export function errorReducer(state: IError | null = null, action: ItiAction) {
    switch (action.type) {
        case getType(errorActions.onError):
            const error = processError(action.payload)

            if (error.type === ErrorType.CanceledAjaxRequest) {
                // ignore, since this can happen when a user clicks a link for Page 2
                // while Page 1 is still loading
                return state
            }

            return error
        case getType(errorActions.clearError):
        case getType(actions.auth.logOut):
            return null
    }

    const payload = (action as any).payload

    if (payload && payload.error) {
        const ierror = processError(payload.error)

        if (!ierror.handled) return ierror
    }

    return state
}

export function errorSaga() {
    //TODO:SAM log errors
    //console.warn(e)
    //const userAgent = window.navigator.userAgent
    //const url = window.location.href
    //const logMsg = JSON.stringify({
    //    message: e ? e.message : undefined,
    //    stack: e ? e.stack : undefined,
    //    error,
    //    userAgent,
    //    url,
    //    redirectedToErrorPage: !!error
    //})
    //// no await - fire & forget
    //api.log.warning({ message: logMsg })
}
