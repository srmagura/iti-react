import React from 'react'
import { AddressInputFieldLengths } from './inputs/addressInput/AddressInputFieldLengths'

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
        address: AddressInputFieldLengths
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
    configurablePager: {
        pageSizes: number[]
    }
}

export type DefaultItiReactContextData = Pick<
    ItiReactContextData,
    'themeColors' | 'fieldLengths'
>

/**
 * Defaults for **parts** of [[`ItiReactContextData`]]. Does not include defaults
 * for properties where there is no reasonable default value.
 */
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

        inputPlaceholder: '#6c757d', // $gray-600,
    },
    fieldLengths: {
        address: {
            line1: 64,
            line2: 64,
            city: 64,
        },
        personName: {
            prefix: 64,
            first: 64,
            middle: 64,
            last: 64,
        },
    },
}

const throwFunction = (): never => {
    throw new Error('ItiReactContextData is not set.')
}

/**
 * A context that provides configuration values used by code within `iti-react-core`.
 * You must wrap your application in with `<ItiReactContext.Provider>` and
 * `<ItiReactCoreContext.Provider>`.
 */
// The default value set here should never be used
export const ItiReactContext = React.createContext<ItiReactContextData>({
    ...defaultItiReactContextData,
    renderLoadingIndicator: throwFunction,
    addressInput: { allowCanadian: false },
    configurablePager: { pageSizes: [10, 25, 50] },
})
