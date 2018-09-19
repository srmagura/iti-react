import * as React from 'react'
import * as moment from 'moment'

import { ValidatedInput, Validators, ValidationFeedback, Validator } from '../Validation'
import {
    IWithValidationInjectedProps,
    withValidation,
    IWithValidationProps
} from '../Validation/WithValidation'

//
// Time conversion functions
//

// Expects hours and minutes to be integers
function toDecimalHours(hours: number, minutes: number): number {
    return hours + minutes / 60
}

// Always returns integers
function toHoursAndMinutes(decimalHours: number): { hours: number; minutes: number } {
    const hours = Math.floor(decimalHours)
    const hoursDecimalPart = decimalHours % 1

    const decimalMinutes = hoursDecimalPart * 60
    const minutes = Math.round(decimalMinutes)

    return { hours, minutes }
}

//
// TimeInputValue
//

// Don't do TimeInputValue = Moment because representing time of day with a Moment / DateTime
// leads to DST bugs.
export type TimeInputValue = {
    hours?: number
    minutes?: number
    ampm?: 'am' | 'pm'
}

export const defaultTimeInuptValue: TimeInputValue = {}

export function timeInputValueFromDecimalHours(decimalHours: number): TimeInputValue {
    const { hours, minutes } = toHoursAndMinutes(decimalHours)
    const mo = moment()
        .hours(hours)
        .minutes(minutes)

    return {
        hours: parseInt(mo.format('h')), // 1, 2, ..., 12
        minutes: mo.minutes(),
        ampm: mo.format('a') as 'am' | 'pm'
    }
}

export function timeInputValueToDecimalHours(value: TimeInputValue): number | undefined {
    if (
        typeof value.hours === 'undefined' ||
        typeof value.minutes === 'undefined' ||
        typeof value.ampm === 'undefined'
    ) {
        return undefined
    }

    let hours = value.hours
    if (value.ampm === 'pm') hours += 12

    return toDecimalHours(hours, value.minutes)
}

//
// TimeInput component
//

const options = {
    hours: [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    minutes: ['00', '15', '30', '45'],
    ampm: ['am', 'pm']
}

interface ITimeInputOwnProps extends React.Props<any> {
    individualInputsRequired: boolean
    showBlank?: boolean
}

type ITimeInputProps = ITimeInputOwnProps & IWithValidationInjectedProps<TimeInputValue>

class _TimeInput extends React.Component<ITimeInputProps> {
    static defaultProps: Pick<ITimeInputProps, 'showBlank'> = {
        showBlank: true
    }

    fromSelectValue = (selectValue: string) => {
        if (selectValue === '') {
            return undefined
        } else {
            return selectValue
        }
    }

    toSelectValue = (value: string | number | undefined) => {
        if (typeof value === 'undefined') {
            return ''
        } else {
            return value.toString()
        }
    }

    parseOptionalInt = (intString: string | undefined) => {
        if (typeof intString === 'undefined') return undefined

        return parseInt(intString)
    }

    onHoursChange: (selectValue: string) => void = selectValue => {
        const { onChange, value } = this.props

        const hours = this.parseOptionalInt(this.fromSelectValue(selectValue))

        onChange({
            ...value,
            hours
        })
    }

    onMinutesChange: (selectValue: string) => void = selectValue => {
        const { onChange, value } = this.props

        const minutes = this.parseOptionalInt(this.fromSelectValue(selectValue))

        onChange({
            ...value,
            minutes
        })
    }

    onAmpmChange: (selectValue: string) => void = selectValue => {
        const { onChange, value } = this.props

        const ampm = this.fromSelectValue(selectValue) as 'am' | 'pm' | undefined

        onChange({
            ...value,
            ampm
        })
    }

    render() {
        const {
            name,
            showValidation,
            value,
            showBlank,
            valid,
            invalidFeedback,
            individualInputsRequired
        } = this.props
        const { hours, minutes, ampm } = value

        const validators = []

        if (individualInputsRequired) {
            // don't display any feedback under individual fields
            validators.push((value: string) => ({
                valid: value !== '',
                invalidFeedback: undefined
            }))
        }

        return (
            <div className="time-input">
                <ValidationFeedback
                    valid={valid}
                    showValidation={showValidation}
                    invalidFeedback={invalidFeedback}
                >
                    <div className="inputs">
                        <input type="hidden" name={name} value={JSON.stringify(value)} />
                        <ValidatedInput
                            name={name + '_hours'}
                            type="select"
                            showValidation={showValidation}
                            validators={validators}
                            value={this.toSelectValue(hours)}
                            onChange={this.onHoursChange}
                        >
                            {showBlank && <option value={''}>HH</option>}
                            {options.hours.map(h => (
                                <option value={h} key={h}>
                                    {h}
                                </option>
                            ))}
                        </ValidatedInput>
                        <ValidatedInput
                            name={name + '_minutes'}
                            type="select"
                            showValidation={showValidation}
                            validators={validators}
                            value={this.toSelectValue(minutes)}
                            onChange={this.onMinutesChange}
                        >
                            {showBlank && <option value={''}>mm</option>}
                            {options.minutes.map(m => {
                                // Need this parseInt because of leading zeros in minutes
                                return (
                                    <option value={parseInt(m)} key={m}>
                                        {m}
                                    </option>
                                )
                            })}
                        </ValidatedInput>
                        <ValidatedInput
                            name={name + '_ampm'}
                            type="select"
                            showValidation={showValidation}
                            validators={validators}
                            value={this.toSelectValue(ampm)}
                            onChange={this.onAmpmChange}
                        >
                            {showBlank && <option value={''} />}
                            {options.ampm.map(s => (
                                <option value={s} key={s}>
                                    {s}
                                </option>
                            ))}
                        </ValidatedInput>
                    </div>
                </ValidationFeedback>
            </div>
        )
    }
}

const TimeInputWithValidation = withValidation<ITimeInputOwnProps, TimeInputValue>({
    defaultValue: {}
})(_TimeInput)

const validator: Validator<TimeInputValue> = (value: TimeInputValue) => {
    const { hours, minutes, ampm } = value
    const types = [typeof hours, typeof minutes, typeof ampm]

    let undefinedCount = 0
    for (const type of types) {
        if (type === 'undefined') undefinedCount++
    }

    return {
        valid: undefinedCount === 0 || undefinedCount === 3,
        invalidFeedback: 'You must enter a valid time or leave all fields blank.'
    }
}

export function TimeInput(
    props: IWithValidationProps<TimeInputValue> & ITimeInputOwnProps
) {
    const validators = [validator].concat(props.validators)

    return <TimeInputWithValidation {...props} validators={validators} />
}

function required(): Validator<TimeInputValue> {
    return (value: TimeInputValue) => {
        const { hours, minutes, ampm } = value

        return {
            valid:
                typeof hours !== 'undefined' &&
                typeof minutes !== 'undefined' &&
                typeof ampm !== 'undefined',
            invalidFeedback: Validators.required()('').invalidFeedback
        }
    }
}

export const TimeValidators = {
    required
}
