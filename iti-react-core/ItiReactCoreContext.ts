import React from 'react'
import moment from 'moment-timezone'

export interface ThemeColors {
    primary: string
    secondary: string
    success: string
    info: string
    warning: string
    danger: string
    light: string
    dark: string

    inputPlaceholder: string
}

export interface ItiReactCoreContextData {
    useAutoRefreshQuery: {
        defaultRefreshInterval: moment.Duration

        // number of consecutive errors required to trigger onConnectionError()
        connectionErrorThreshold: number
        isConnectionError(e: any): boolean
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

const throwFunction = () => {
    throw new Error('ItiReactCoreContextData is not set.')
}

// The default set here should never be used
export const ItiReactContext = React.createContext<ItiReactCoreContextData>({
    ...defaultItiReactCoreContextData,
    useAutoRefreshQuery: {
        ...defaultItiReactCoreContextData.useAutoRefreshQuery,
        isConnectionError: throwFunction
    }
})
