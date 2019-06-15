import { createStore, combineReducers, Action } from 'redux'
import { ActionType, createStandardAction, getType } from 'typesafe-actions'
import { UserDto } from 'Models'

export const actions = {
    setUser: createStandardAction('SET_USER')<UserDto | null>()
}

interface RouteSpecificState {

}

export interface AppState {
    readonly user: UserDto | null

    readonly routeSpecificState: {
        current: RouteSpecificState
        prev?: RouteSpecificState
    }
}

type ItiAction = ActionType<typeof actions>

const reducer = combineReducers<AppState>({
    user: (state = null, action: ItiAction) => {
        switch (action.type) {
            case getType(actions.setUser):
                return action.payload
        }

        return state
    },
    routeSpecificState: (state = { current: {}}, action: ItiAction) => state
})

export const store = createStore(reducer)
