import * as React from 'react'

export interface IThemeColors {
    primary: string
    danger: string
    success: string
}

export interface IITIReactContextData {
    loadingIndicatorComponent: React.StatelessComponent<{}>
    themeColors: IThemeColors

    fieldLengths: {
        address: {
            line1: number
            line2: number
            city: number
            zip: number
        }
    }
}

export const defaultITIReactContextData: IITIReactContextData = {
    loadingIndicatorComponent: () => null,
    themeColors: {
        primary: '#007bff',
        danger: '#dc3545',
        success: '#28a745'
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

export const ITIReactContext = React.createContext<IITIReactContextData>(
    defaultITIReactContextData
)
