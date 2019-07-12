import { UserDto } from 'Models'
import { AuthState } from '_Redux/Auth/AuthReducer'
import { IError } from '_Redux/Error/ErrorHandling'

//interface RouteSpecificState {

//}

export interface AppState {
    readonly auth: AuthState
    readonly error: IError | null

    //readonly routeSpecificState: {
    //    current: RouteSpecificState
    //    prev?: RouteSpecificState
    //}
}
