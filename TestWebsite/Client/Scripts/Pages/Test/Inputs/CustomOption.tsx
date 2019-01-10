import * as React from 'react'
import { OptionProps } from 'react-select/lib/components/Option'
import { components } from 'react-select/lib/components'

export interface CustomOptionType {
    value: string
    label: string
    color: string
}

export function CustomOption(props: OptionProps<CustomOptionType>) {
    const { children, ...nonChildrenProps } = props

    return (
        <components.Option {...nonChildrenProps}>
            <span style={{ color: props.data.color }}>~{children}~</span>
        </components.Option>
    )
}
