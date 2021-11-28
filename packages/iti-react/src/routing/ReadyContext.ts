import React, { useContext } from 'react'
import { Location } from 'react-router-dom'

export interface ReadyContextData<TOnReadyArgs> {
    ready: boolean
    onReady(args: TOnReadyArgs): void
    location: Location
}

/** @internal */
export const ReadyContext = React.createContext<ReadyContextData<unknown>>({
    ready: false,
    onReady: () => {
        throw new Error('ReadyContext not set.')
    },
    location: {
        pathname: 'ReadyContext not set',
        state: undefined,
        key: '',
        search: '',
        hash: '',
    },
})

export function useReadyCore<TOnReadyArgs>(): ReadyContextData<TOnReadyArgs> {
    return useContext(ReadyContext)
}
