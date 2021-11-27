import { IError, ITIAction } from '@interface-technologies/iti-react'
import { processError, ErrorType } from '_util/errorHandling'
import { onError } from './onError'
import { ErrorPayload } from './ErrorPayload'

export function getErrorFromAction(action: ITIAction): IError<ErrorType> | undefined {
    let error: IError<ErrorType> | undefined

    if (onError.match(action)) {
        error = processError(action.payload)
    } else {
        const { payload } = action

        if (payload && (payload as ErrorPayload).error) {
            error = processError((payload as ErrorPayload).error)
        }
    }

    if (error && error.handled) return undefined

    if (error && error.type === ErrorType.CanceledPromise) {
        // ignore since the app will cancel requests for many reasons
        return undefined
    }

    return error
}

export function errorReducer(
    state: IError<ErrorType> | null = null,
    action: ITIAction
): IError<ErrorType> | null {
    const error = getErrorFromAction(action)
    if (error) return error

    return state
}
