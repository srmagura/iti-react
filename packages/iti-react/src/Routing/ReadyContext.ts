import React, { useContext } from 'react'

export interface ReadyContextData<TOnReadyArgs> {
    ready: boolean
    onReady(args: TOnReadyArgs): void
}

/** @internal */
export const ReadyContext = React.createContext<ReadyContextData<unknown>>({
    ready: false,
    onReady: () => {
        throw new Error('ReadyContext not set.')
    },
})

export function useReadyCore<TOnReadyArgs>(): ReadyContextData<TOnReadyArgs> {
    return useContext(ReadyContext)
}
