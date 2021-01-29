import React from 'react'
import { components, OptionProps } from 'react-select'

export interface CustomOptionType {
    value: string
    label: string
    color: string
}

export function CustomOption(
    props: OptionProps<CustomOptionType, boolean>
): React.ReactElement {
    const { children, ...nonChildrenProps } = props

    return (
        <components.Option {...nonChildrenProps}>
            <span style={{ color: props.data.color }}>~{children}~</span>
        </components.Option>
    )
}