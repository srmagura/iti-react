import { AppState } from '_Redux/AppState'
import { IError } from './ErrorHandling'
import { nullToUndefined } from '@interface-technologies/iti-react'

export function errorSelector(state: AppState): IError | undefined {
    return nullToUndefined(state.error)
}
