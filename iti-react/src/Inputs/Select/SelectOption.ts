import { GroupTypeBase, createFilter } from 'react-select'
import { partition, flatten } from 'lodash'

/** The option object that's used with all of our Select components. */
export interface SelectOption {
    value: string | number
    label: string
    isDisabled?: boolean

    /** Only applies to multiselect */
    isFixed?: boolean
}

/**  */
export function getNonGroupOptions(
    options: (SelectOption | GroupTypeBase<SelectOption>)[]
): SelectOption[] {
    const [groupOptions, nonGroupOptions] = partition(
        options,
        (o) => typeof o.value === 'undefined'
    ) as [GroupTypeBase<SelectOption>[], SelectOption[]]

    return [
        ...nonGroupOptions,
        ...flatten<SelectOption>(groupOptions.map((go) => go.options)),
    ]
}

export const filterOption: ReturnType<typeof createFilter> = createFilter({
    stringify: (o) => (o as { label: string }).label,
})
