import { StateType, ActionType } from 'typesafe-actions'

declare module 'typesafe-actions' {
    interface Types {
        RootAction: ActionType<typeof import('_Redux/Actions').actions>
    }
}
