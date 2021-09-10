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

export interface DefaultItiReactCoreContextData {
    useAutoRefreshQuery: Omit<
        ItiReactCoreContextData['useAutoRefreshQuery'],
        'isConnectionError'
    >
}

/**
 * Defaults for **parts** of [[`ItiReactCoreContextData`]]. Does not include defaults
 * for properties where there is no reasonable default value.
 */
export const defaultItiReactCoreContextData: DefaultItiReactCoreContextData = {
    useAutoRefreshQuery: {
        defaultRefreshInterval: moment.duration(1, 'minute'),
        connectionErrorThreshold: 2,
    },
}

const throwFunction = (): never => {
    throw new Error('ItiReactCoreContextData is not set.')
}

/**
 * A context that provides configuration values used by code within `iti-react-core`.
 * You must wrap your application in with `<ItiReactCoreContext.Provider>`.
 */
// The default set here should never be used
export const ItiReactCoreContext = React.createContext<ItiReactCoreContextData>({
    ...defaultItiReactCoreContextData,
    onError: throwFunction,
    useAutoRefreshQuery: {
        ...defaultItiReactCoreContextData.useAutoRefreshQuery,
        isConnectionError: throwFunction,
    },
})
