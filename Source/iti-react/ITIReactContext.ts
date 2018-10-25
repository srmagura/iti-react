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

export interface ITIReactContextData {
    loadingIndicatorComponent: React.StatelessComponent<{}>
    themeColors: ThemeColors

    fieldLengths: {
        address: {
            line1: number
            line2: number
            city: number
            zip: number
        }
    }
}

export const defaultITIReactContextData: ITIReactContextData = {
    loadingIndicatorComponent: () => null,
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
            city: 64,
            zip: 16
        }
    }
}

export const ITIReactContext = React.createContext<ITIReactContextData>(
    defaultITIReactContextData
)
