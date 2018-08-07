import * as React from 'react'
import { withValidation, Validator, ValidatedSelect, SelectValue, Validators } from '..'

// We are purprosely not bringing in moment-timezone.
//
// If you install @types/moment-timezone, you will have to import `moment`
// from 'moment-timezone' insead of 'moment' *everywhere* you use `moment`.
// Because of this, any project using iti-react would have to include moment-timezone
// (a medium-sized library) in its JS bundle.

type IanaTimeZone = string

export type TimeZoneInputValue = IanaTimeZone | null

export const defaultTimeZoneInputValue: TimeZoneInputValue = null

interface ICommonTimeZone {
    ianaTimeZone: IanaTimeZone
    displayName: string
}

/* Not including the zone abbreviation (e.g. EST / EDT ). This becomes a huge pain in
 * the ass since the abbreviation depends on the current date. */
const commonTimeZones: ICommonTimeZone[] = [
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

//const zones = moment.tz.names()
//for (var tzName of allUsTimeZones) {
//    if (zones.indexOf(tzName) === -1) {
//        if (BrowserUtil.isBrowser()) {
//            throw new Error(`Test failed: Invalid timezone ${tzName}`)
//        }
//    }
//}

interface ITimeZoneInputProps extends React.Props<any> {
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

export class TimeZoneInput extends React.Component<ITimeZoneInputProps> {
    static defaultProps: Pick<ITimeZoneInputProps, 'width'> = {
        width: 200
    }

    onChange = (value: SelectValue) => {
        const { onChange } = this.props

        if (onChange) {
            if (typeof value === 'number')
                throw new Error('TimeZoneInput received number.')

            onChange(value)
        }
    }

    convertValue = (value: TimeZoneInputValue | undefined) => {
        if (typeof value === 'undefined') return undefined
        if (value === null) return null

        return value
    }

    convertValidator = (validator: Validator<TimeZoneInputValue>) => {
        return (value: SelectValue) => {
            if (typeof value === 'number')
                throw new Error('TimeZoneInput received number.')

            return validator(value)
        }
    }

    getOptions = () => {
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

    render() {
        const { name, validators, onChange, ...passThroughProps } = this.props

        return (
            <ValidatedSelect
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
    return (value: TimeZoneInputValue) => ({
        valid: value !== null,
        invalidFeedback: Validators.required()('').invalidFeedback
    })
}

export const TimeZoneValidators = {
    required
}
