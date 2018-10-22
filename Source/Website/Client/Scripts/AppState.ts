import { createStore, combineReducers, Action } from 'redux'
import { ActionType, createStandardAction, getType } from 'typesafe-actions'
import { UserDto } from 'Models'

export const actions = {
    setUser: createStandardAction('SET_USER')<UserDto | null>()
}

export interface AppState {
    readonly user: UserDto | null
}

type MyActionType = ActionType<typeof actions>

const reducer = combineReducers<AppState>({
    user: (state = null, action: MyActionType) => {
        switch (action.type) {
            case getType(actions.setUser):
                return action.payload
        }

        return state
    }
})

export const store = createStore(reducer)

// for debugging
;(window as any).getReduxState = () => store.getState()
