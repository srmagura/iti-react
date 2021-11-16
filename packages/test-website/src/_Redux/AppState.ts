import { AuthState } from '_Redux/Auth/AuthReducer'
import { IError } from './Error/ErrorHandling'

export interface AppState {
    readonly auth: AuthState
    readonly error: IError | null
}
