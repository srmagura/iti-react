import { GroupBase, createFilter } from 'react-select'
import { partition, flatten } from 'lodash'

/** The option object that's used with all of our Select components. */
export interface SelectOption {
    value: string | number
    label: string
    isDisabled?: boolean

    /** Only applies to multiselect */
    isFixed?: boolean
}

/**
 * Takes in a list of normal [[`SelectOption`]]s and "group" select options
 * and flattens it out into a list of normal [[`SelectOption`]]s.
 */
export function getNonGroupOptions(
    options: (SelectOption | GroupBase<SelectOption>)[]
): SelectOption[] {
    const [groupOptions, nonGroupOptions] = partition(
        options,
        (o) => typeof (o as { value?: unknown }).value === 'undefined'
    ) as [GroupBase<SelectOption>[], SelectOption[]]

    return [
        ...nonGroupOptions,
        ...flatten<SelectOption>(groupOptions.map((go) => go.options)),
    ]
}

/**
 * @internal
 *
 * Makes it so typing in one of our select components filters the options by the `label`
 * only, not the `label` and the `value` which is the default behavior.
 *
 * See https://react-select.com/advanced#custom-filter-logic.
 */
export const filterOption: ReturnType<typeof createFilter> = createFilter({
    stringify: (o) => (o as { label: string }).label,
})
