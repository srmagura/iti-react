import { getType } from 'typesafe-actions'
import { TestWebsiteAction } from '_Redux/Actions'
import { ITIAction } from '@interface-technologies/iti-react'
import { IError, processError, ErrorType } from './ErrorHandling'
import { onError } from './ErrorActions'
import { ErrorPayload } from './ErrorPayload'

export function getErrorFromAction(action: ITIAction): IError | undefined {
    let error: IError | undefined

    if (action.type === getType(onError)) {
        error = processError(action.payload)
    } else {
        const { payload } = action

        if (payload && (payload as ErrorPayload).error) {
            error = processError((payload as ErrorPayload).error)
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
    action: TestWebsiteAction
): IError | null {
    const error = getErrorFromAction(action)
    if (error) return error

    return state
}
