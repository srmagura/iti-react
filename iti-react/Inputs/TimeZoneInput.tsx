import React from 'react'
import {
    Validator,
    Validators,
    ValidatorOutput
} from '@interface-technologies/iti-react-core'
import { SelectValue, ValidatedSelect, SelectOption } from './Select'
import { GroupType } from 'react-select'

// This component is just a dropdown, it's not going to do any datetime stuff for you.

export type TimeZoneInputValue = string | null

export const defaultTimeZoneInputValue: TimeZoneInputValue = null

interface CommonTimeZone {
    ianaTimeZone: string
    displayName: string
}

/* Not including the zone abbreviation (e.g. EST / EDT ). This becomes a huge pain in
 * the ass since the abbreviation depends on the current date. */
const commonTimeZones: CommonTimeZone[] = [
    {
        ianaTimeZone: 'America/New_York',
        displayName: 'Eastern Time'
    },
    {
        ianaTimeZone: 'America/Chicago',
        displayName: 'Central Time'
    },
    {
        ianaTimeZone: 'America/Denver',
        displayName: 'Mountain Time'
    },
    {
        ianaTimeZone: 'America/Los_Angeles',
        displayName: 'Pacific Time'
    }
]

const allUsTimeZones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Adak',
    'America/Yakutat',
    'America/Juneau',
    'America/Sitka',
    'America/Metlakatla',
    'America/Anchorage',
    'America/Nome',
    'America/Phoenix',
    'Pacific/Honolulu',
    'America/Indiana/Marengo',
    'America/Indiana/Vincennes',
    'America/Indiana/Tell_City',
    'America/Indiana/Petersburg',
    'America/Indiana/Knox',
    'America/Indiana/Winamac',
    'America/Indiana/Vevay',
    'America/Kentucky/Louisville',
    'America/Indiana/Indianapolis',
    'America/Kentucky/Monticello',
    'America/Menominee',
    'America/North_Dakota/Center',
    'America/North_Dakota/New_Salem',
    'America/North_Dakota/Beulah',
    'America/Boise',
    'America/Puerto_Rico',
    'America/St_Thomas'
]

const otherUsTimeZones = allUsTimeZones.filter(
    tz => !commonTimeZones.find(ctz => ctz.ianaTimeZone === tz)
)

interface TimeZoneInputProps {
    id?: string
    name: string
    placeholder?: string
    isClearable?: boolean

    value?: TimeZoneInputValue
    onChange?(value: TimeZoneInputValue): void
    defaultValue?: TimeZoneInputValue

    showValidation: boolean
    onValidChange?(name: string, valid: boolean): void
    validationKey?: string | number
    validators: Validator<TimeZoneInputValue>[]

    width?: number
}

export class TimeZoneInput extends React.Component<TimeZoneInputProps> {
    static defaultProps: Pick<TimeZoneInputProps, 'width'> = {
        width: 200
    }

    onChange = (value: SelectValue): void => {
        const { onChange } = this.props

        if (onChange) {
            if (typeof value === 'number')
                throw new Error('TimeZoneInput received number.')

            onChange(value)
        }
    }

    convertValue = (
        value: TimeZoneInputValue | undefined
    ): TimeZoneInputValue | null | undefined => {
        if (typeof value === 'undefined') return undefined
        if (value === null) return null

        return value
    }

    convertValidator = (validator: Validator<TimeZoneInputValue>) => {
        return (value: SelectValue): ValidatorOutput => {
            if (typeof value === 'number')
                throw new Error('TimeZoneInput received number.')

            return validator(value)
        }
    }

    getOptions = (): GroupType<SelectOption>[] => {
        const commonOptions = commonTimeZones.map(o => ({
            value: o.ianaTimeZone,
            label: o.displayName
        }))

        const advancedOptions = otherUsTimeZones.map(o => ({
            value: o,
            label: o.replace('America/', '')
        }))

        return [
            // the empty label messes up the styling a bit
            { label: '', options: commonOptions },
            { label: 'Advanced options', options: advancedOptions }
        ]
    }

    render(): React.ReactElement {
        const { id, name, validators, ...passThroughProps } = this.props

        return (
            <ValidatedSelect
                id={id}
                name={name}
                options={this.getOptions()}
                validators={validators.map(this.convertValidator)}
                onChange={this.onChange}
                {...passThroughProps}
            />
        )
    }
}

function required(): Validator<TimeZoneInputValue> {
    return (value: TimeZoneInputValue): ValidatorOutput => ({
        valid: value !== null,
        invalidFeedback: Validators.required()('').invalidFeedback
    })
}

export const TimeZoneValidators = {
    required
}
