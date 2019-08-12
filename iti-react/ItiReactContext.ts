import * as React from 'react'
import * as moment from 'moment-timezone'

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

export interface ItiReactContextData {
    renderLoadingIndicator: () => React.ReactNode
    themeColors: ThemeColors

    fieldLengths: {
        address: {
            line1: number
            line2: number
            city: number
        }
        personName: {
            prefix: number
            first: number
            middle: number
            last: number
        }
    }

    addressInput: {
        allowCanadian: boolean
    }

    useAutoRefreshQuery: {
        defaultRefreshInterval: moment.Duration

        // number of consecutive errors required to trigger onConnectionError()
        connectionErrorThreshold: 2
        isConnectionError(e: any): boolean
    }
}

// Only default properties that have a reasonable default
export interface DefaultItiReactContextData
    extends Pick<ItiReactContextData, 'themeColors' | 'fieldLengths'> {
    useAutoRefreshQuery: Omit<
        ItiReactContextData['useAutoRefreshQuery'],
        'isConnectionError'
    >
}

export const defaultItiReactContextData: DefaultItiReactContextData = {
    themeColors: {
        primary: '#007bff',
        secondary: '#6c757d',
        success: '#28a745',
        info: '#17a2b8',
        warning: '#ffc107',
        danger: '#dc3545',
        light: '#f8f9fa',
        dark: '#343a40',

        inputPlaceholder: '#adb5bd' // $gray-500,
    },
    fieldLengths: {
        address: {
            line1: 64,
            line2: 64,
            city: 64
        },
        personName: {
            prefix: 64,
            first: 64,
            middle: 64,
            last: 64
        }
    },
    useAutoRefreshQuery: {
        defaultRefreshInterval: moment.duration(1, 'minute'),
        connectionErrorThreshold: 2
    }
}

const throwFunction = () => {
    throw new Error('ItiReactContextData is not set.')
}

// The default set here should never be used
export const ItiReactContext = React.createContext<ItiReactContextData>({
    ...defaultItiReactContextData,
    renderLoadingIndicator: throwFunction,
    useAutoRefreshQuery: {
        ...defaultItiReactContextData.useAutoRefreshQuery,
        isConnectionError: throwFunction
    },
    addressInput: { allowCanadian: false }
})
