import { UserDto } from 'Models'


interface RouteSpecificState {

}

export interface AppState {
    readonly user: UserDto | null

    readonly routeSpecificState: {
        current: RouteSpecificState
        prev?: RouteSpecificState
    }
}
