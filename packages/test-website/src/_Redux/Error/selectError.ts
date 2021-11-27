import { AppState } from '_Redux/AppState'
import { IError, nullToUndefined } from '@interface-technologies/iti-react'
import { ErrorType } from '_util/errorHandling'

export function selectError(state: AppState): IError<ErrorType> | undefined {
    return nullToUndefined(state.error)
}
