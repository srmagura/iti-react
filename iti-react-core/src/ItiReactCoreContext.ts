import React from 'react'
import moment from 'moment-timezone'

export interface ItiReactCoreContextData {
    onError(e: unknown): void

    useAutoRefreshQuery: {
        defaultRefreshInterval: moment.Duration

        // number of consecutive errors required to trigger onConnectionError()
        connectionErrorThreshold: number
        isConnectionError(e: unknown): boolean
    }
}

// Only set defaults for properties that have a reasonable default
export interface DefaultItiReactCoreContextData {
    useAutoRefreshQuery: Omit<
        ItiReactCoreContextData['useAutoRefreshQuery'],
        'isConnectionError'
    >
}

export const defaultItiReactCoreContextData: DefaultItiReactCoreContextData = {
    useAutoRefreshQuery: {
        defaultRefreshInterval: moment.duration(1, 'minute'),
        connectionErrorThreshold: 2
    }
}

const throwFunction = (): never => {
    throw new Error('ItiReactCoreContextData is not set.')
}

// The default set here should never be used
export const ItiReactCoreContext = React.createContext<ItiReactCoreContextData>({
    ...defaultItiReactCoreContextData,
    onError: throwFunction,
    useAutoRefreshQuery: {
        ...defaultItiReactCoreContextData.useAutoRefreshQuery,
        isConnectionError: throwFunction
    }
})
