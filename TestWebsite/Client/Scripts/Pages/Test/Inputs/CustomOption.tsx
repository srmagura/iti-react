import * as React from 'react'
import { OptionProps } from 'react-select/lib/components/Option'
import { components } from 'react-select/lib/components'
import { SelectOption } from '@interface-technologies/iti-react'

export function CustomOption(props: OptionProps<SelectOption>) {
    const { children, ...nonChildrenProps } = props

    return (
        <components.Option {...nonChildrenProps}>
            <span style={{ color: 'lightseagreen' }}>~{children}~</span>
        </components.Option>
    )
}
