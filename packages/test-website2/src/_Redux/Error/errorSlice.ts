import { IError, ITIAction, nullToUndefined } from '@interface-technologies/iti-react'
import { createAction } from '@reduxjs/toolkit'
import { Reducer } from 'redux'
import type { AppState } from '_Redux/AppState'
import { ErrorType, processError } from '_util/errorHandling'

export const onError = createAction<unknown>('error/onError')

export function getErrorFromAction(action: ITIAction): IError<ErrorType> | undefined {
    let error: IError<ErrorType> | undefined

    if (onError.match(action)) {
        error = processError(action.payload)
    } else {
        const { payload } = action as { payload?: { error?: unknown } }

        if (payload && payload.error && Object.keys(payload).length === 1) {
            error = processError(payload.error)
        }
    }

    if (error && error.handled) return undefined

    if (error && error.type === ErrorType.CanceledPromise) {
        // ignore since the app will cancel requests for many reasons
        return undefined
    }

    return error
}

export const errorReducer: Reducer<IError<ErrorType> | null, ITIAction> = (
    state = null,
    action
) => {
    const error = getErrorFromAction(action)
    if (error) return error

    return state
}

export function selectError(state: AppState): IError<ErrorType> | undefined {
    return nullToUndefined(state.error)
}
