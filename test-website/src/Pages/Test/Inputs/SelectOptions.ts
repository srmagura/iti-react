import { SelectOption } from '@interface-technologies/iti-react'

interface ColorOption extends SelectOption {
    color: string
}

export const colorOptions: ColorOption[] = [
    {
        value: 'ocean',
        label: 'Ocean',
        color: '#00B8D9'
    },
    {
        value: 'blue',
        label: 'Blue (isDisabled: true)',
        color: '#0052CC',
        isDisabled: true
    },
    { value: 'orange', label: 'Orange', color: '#FF8B00' },
    { value: 'yellow', label: 'Yellow', color: '#FFC400' },
    { value: 'green', label: 'Green', color: '#36B37E' },
    { value: 'forest', label: 'Forest', color: '#00875A' },
    { value: 'slate', label: 'Slate', color: '#253858' },
    { value: 'purple', label: 'Purple (isFixed: true)', color: '#5243AA', isFixed: true },
    { value: 'red', label: 'Red (isFixed: true)', color: '#FF5630', isFixed: true },
    {
        value: 'silver',
        label: 'Silver but with a super long name to test various things and stuff',
        color: '#666666'
    }
]

export const flavorOptions = [
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'salted-caramel', label: 'Salted Caramel' }
]

export const groupedOptionsWithoutFixed = [
    {
        label: 'Colours',
        options: colorOptions.filter(o => !o.isFixed)
    },
    {
        label: 'Flavours',
        options: flavorOptions
    }
]