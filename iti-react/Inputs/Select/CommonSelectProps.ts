import { SelectOption } from './ValidatedSelect'
import { GetSelectStyles } from './GetSelectStyles'
import { SelectComponentsConfig } from 'react-select'

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
    components?: SelectComponentsConfig<any>
    /* eslint-enable @typescript-eslint/no-explicit-any */

    menuIsOpen?: boolean
    onMenuOpen?(): void
    onMenuClose?(): void
}
