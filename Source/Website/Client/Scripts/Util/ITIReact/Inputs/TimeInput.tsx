import * as React from 'react'
import * as moment from 'moment'

import {
    ValidatedInput,
    Validators,
    ValidationFeedback,
    Validator
} from '../Validation'
import {
    IWithValidationInjectedProps,
    withValidation,
    IWithValidationProps
} from '../Validation/WithValidation'

/* You'll notice there are no moment objects used in this component.
 * (Except internally for string formatting.)
 * There's a good reason for this: TimeInput doesn't know the date or timezone,
 * so it can't create a moment object without leaving the date and timezone
 * set to bogus values. If we did return a moment with a bogus date, it would be
 * too easy to misuse. So, we just return the hours, minutes, and ampm. */

export const timeFormat = 'h:mm a'

const options = {
    hours: [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    minutes: ['00', '15', '30', '45'],
    ampm: ['am', 'pm']
}

export type TimeInputValue = {
    hours?: number
    minutes?: number
    ampm?: string
}

export function timeInputValueFromMoment(
    myMoment: moment.Moment
): TimeInputValue {
    return {
        hours: parseInt(myMoment.format('h')),
        minutes: myMoment.minute(),
        ampm: myMoment.format('a')
    }
}

export const timeInputFormat = 'h:m a'

// value, onChange, and defaultValue are work with formatted time strings. See the
// timeFormat constant for the format string. We're using strings here instead of
// Moment objects, because this component does not know the timezone / UTC offset of the times.
interface ITimeInputOwnProps extends React.Props<any> {
    individualInputsRequired: boolean
    showBlank?: boolean
}

type ITimeInputProps = ITimeInputOwnProps &
    IWithValidationInjectedProps<TimeInputValue>

class _TimeInput extends React.Component<ITimeInputProps, {}> {
    static defaultProps: Partial<ITimeInputProps> = {
        showBlank: true
    }

    //static deserializeValue = (value: string) => {
    //    const time = moment(value, timeFormat)

    //    if (time.isValid()) {
    //        return {
    //            hours: parseInt(time.format('h')), // 1, 2, ..., 12
    //            minutes: time.minutes(),
    //            ampm: time.format('a')
    //        }
    //    } else {
    //        return {
    //            hours: undefined,
    //            minutes: undefined,
    //            ampm: undefined
    //        }
    //    }
    //}

    static serializeValue = (timeParts: {
        hours?: number
        minutes?: number
        ampm?: string
    }) => {
        const { hours, minutes, ampm } = timeParts

        if (
            typeof hours !== 'undefined' &&
            typeof minutes !== 'undefined' &&
            typeof ampm !== 'undefined'
        ) {
            // Make sure that the string with give to onChange is in timeFormat
            const time = moment(`${hours}:${minutes} ${ampm}`, timeInputFormat)
            const formatted = time.format(timeFormat)
            return formatted
        }

        return ''
    }

    callOnChange = () => {
        const { onChange } = this.props
        onChange(this.state)
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
        const value = this.fromSelectValue(selectValue)
        const hours = this.parseOptionalInt(value)

        this.setState(s => ({ ...s, hours }), this.callOnChange)
    }

    onMinutesChange: (selectValue: string) => void = selectValue => {
        const value = this.fromSelectValue(selectValue)
        const minutes = this.parseOptionalInt(value)

        this.setState(s => ({ ...s, minutes }), this.callOnChange)
    }

    onAmpmChange: (selectValue: string) => void = selectValue => {
        const value = this.fromSelectValue(selectValue)
        this.setState(s => ({ ...s, ampm: value }), this.callOnChange)
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
                        <input
                            type="hidden"
                            name={name}
                            value={_TimeInput.serializeValue(value)}
                        />
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

const TimeInputWithValidation = withValidation<
    ITimeInputOwnProps,
    TimeInputValue
>({
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
        invalidFeedback:
            'You must enter a valid time or leave all fields blank.'
    }
}

export function requiredTimeValidator() {
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

export function TimeInput(
    props: IWithValidationProps<TimeInputValue> & ITimeInputOwnProps
) {
    const validators = [validator].concat(props.validators)

    return <TimeInputWithValidation {...props} validators={validators} />
}
