import { getType } from 'typesafe-actions'
import { ItiAction } from '_Redux/Actions'
import { IError, processError, ErrorType } from './ErrorHandling'
import { errorActions } from './ErrorActions'

export function getErrorFromAction(action: ItiAction): IError | undefined {
    let error: IError | undefined

    if (action.type === getType(errorActions.onError)) {
        error = processError(action.payload)
    } else {
        const payload = (action as any).payload

        if (payload && payload.error) {
            error = processError(payload.error)
        }
    }

    if (error && error.handled) return undefined

    if (error && error.type === ErrorType.CanceledAjaxRequest) {
        // ignore since the app will cancel requests for many reasons
        return undefined
    }

    return error
}

export function errorReducer(
    state: IError | null = null,
    action: ItiAction
): IError | null {
    const error = getErrorFromAction(action)
    if (error) return error

    return state
}
