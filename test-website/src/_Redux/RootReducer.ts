import {  combineReducers,  } from 'redux'
import {  getType } from 'typesafe-actions'
import { ItiAction, actions } from './Actions'
import { AppState } from './AppState'

export const rootReducer = combineReducers<AppState>({
    user: (state = null, action: ItiAction) => {
        switch (action.type) {
            case getType(actions.setUser):
                return action.payload
        }

        return state
    },
    routeSpecificState: (state = { current: {}}, action: ItiAction) => state
})

