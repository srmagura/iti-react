import * as React from 'react'

export interface IThemeColors {
    primary: string
    danger: string
    success: string
}

export interface IITIReactContextData {
    loadingIndicatorComponent: React.StatelessComponent<{}>
    themeColors: IThemeColors
}

export const defaultITIReactContextData: IITIReactContextData = {
    loadingIndicatorComponent: () => null,
    themeColors: {
        primary: '#007bff',
        danger: '#dc3545',
        success: '#28a745'
    }
}

export const ITIReactContext = React.createContext<IITIReactContextData>(
    defaultITIReactContextData
)
