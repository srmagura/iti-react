import { UserDto } from 'Models'
import { AuthState } from '_Redux/Auth/AuthReducer';


interface RouteSpecificState {

}

export interface AppState {
    readonly auth: AuthState

    readonly routeSpecificState: {
        current: RouteSpecificState
        prev?: RouteSpecificState
    }
}
