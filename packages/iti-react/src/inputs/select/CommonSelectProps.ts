import { MenuPlacement } from 'react-select'
// TODO:SAM https://github.com/JedWatson/react-select/issues/4798
import { SelectComponentsConfig } from 'react-select/dist/declarations/src/components'
import { SelectOption } from './SelectOption'
import { GetSelectStyles, getSelectStyles } from './getSelectStyles'

/**
 * Props that apply to all of the select components: [[`ValidatedSelect`]],
 * [[`ValidatedMultiSelect`]], and [[`ValidatedAsyncSelect`]].
 */
export interface CommonSelectProps {
    id?: string

    isClearable?: boolean
    isLoading?: boolean
    enabled?: boolean
    isOptionEnabled?(option: SelectOption): boolean

    placeholder?: string
    className?: string
    formControlSize?: 'sm' | 'lg'
    width?: number
    getStyles?: GetSelectStyles

    'aria-label'?: string
    'aria-labelledby'?: string

    // Any to allow using option types that extend SelectOption, without having
    // to make ValidatedSelect truly generic (annoying to do in React)
    /* eslint-disable @typescript-eslint/no-explicit-any */
    components?: SelectComponentsConfig<any, boolean, any>
    /* eslint-enable @typescript-eslint/no-explicit-any */

    menuIsOpen?: boolean
    onMenuOpen?(): void
    onMenuClose?(): void

    menuPlacement?: MenuPlacement
}

/** @internal */
export const defaultSelectProps: Required<
    Pick<CommonSelectProps, 'enabled' | 'isClearable' | 'getStyles' | 'menuPlacement'>
> = {
    enabled: true,
    isClearable: false,
    getStyles: getSelectStyles,
    menuPlacement: 'auto',
}
