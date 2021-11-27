import type { Dispatch } from 'react'

export interface ITIAction {
    type: string
    payload?: unknown
    meta?: unknown
}

export type ITIDispatch = Dispatch<ITIAction>
