import * as React from 'react'

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
    }

    allowCanadianAddresses: boolean
}

export const defaultItiReactContextData: ItiReactContextData = {
    renderLoadingIndicator: () => null,
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
        }
    },
    allowCanadianAddresses: false
}

export const ItiReactContext = React.createContext<ItiReactContextData>(
    defaultItiReactContextData
)
