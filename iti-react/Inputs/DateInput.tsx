import React from 'react'
import moment from 'moment-timezone'
import DatePicker from 'react-datepicker'
import {
    getValidationClass,
    ValidationFeedback,
    Validator,
    WithValidationInjectedProps,
    withValidation,
    WithValidationProps
} from '../Validation'
import { getGuid } from '..'

// MomentJS format strings
export const dateInputFormat = 'M/D/YYYY'
const timeFormat = 'h:mm a'
export const dateTimeInputFormat = dateInputFormat + ' ' + timeFormat

// Equivalent date-fns format strings (used by react-datepicker)
export const fnsDateInputFormat = 'M/d/yyyy'
const fnsTimeFormat = 'h:mm a'
export const fnsDateTimeInputFormat = fnsDateInputFormat + ' ' + fnsTimeFormat

export type DateInputValue = {
    // this moment doesn't have to be a specific time zone. UTC is fine, for example
    moment?: moment.Moment
    raw: string
}

export const defaultDateInputValue: DateInputValue = {
    moment: undefined,
    raw: ''
}

export function dateInputValueFromMoment(
    m: moment.Moment,
    options: { includesTime: boolean; timeZone: string }
): DateInputValue {
    const timeZone = options.timeZone === 'local' ? moment.tz.guess() : options.timeZone

    return {
        moment: m,
        raw: m
            .tz(timeZone)
            .format(options.includesTime ? dateTimeInputFormat : dateInputFormat)
    }
}

export function convertJsDateToTimeZone(date: Date, timeZone: string): Date {
    const str = date.toLocaleString('en-US', { timeZone })
    return new Date(str)
}

export function parseJsDateIgnoringTimeZone(date: Date, timeZone: string): moment.Moment {
    const str = date.toLocaleString('en-US')
    return moment.tz(str, 'M/D/YYYY, h:mm:ss A', timeZone)
}

interface DateInputOwnProps {
    id?: string
    placeholder?: string

    // This class name will be used *in addition to* form-control and the validation feedback class
    className?: string

    popperPlacement?: string
    includesTime?: boolean
    timeIntervals?: number
    enabled?: boolean
    showPicker?: boolean
    readOnly?: boolean

    // pass 'local' to use moment.tz.guess() as the time zone
    timeZone: string
}

type DateInputProps = DateInputOwnProps & WithValidationInjectedProps<DateInputValue>

class _DateInput extends React.Component<DateInputProps, {}> {
    static defaultProps: Pick<
        DateInputOwnProps,
        'enabled' | 'showPicker' | 'readOnly'
    > = {
        enabled: true,
        showPicker: true,
        readOnly: false
    }

    // Use this instead of this.props.id
    id: string

    get timeZone(): string {
        const { timeZone } = this.props

        return timeZone === 'local' ? moment.tz.guess() : timeZone
    }

    constructor(props: DateInputProps) {
        super(props)

        // DateInput needs an ID to function, so create an ID if one has not been provided.
        this.id = this.props.id ? this.props.id : getGuid()
    }

    componentDidUpdate() {
        // If, for some reason, the ID prop changes after the constructor is called
        if (this.props.id && this.props.id !== this.id) {
            this.id = this.props.id
        }
    }

    get fnsFormat() {
        return this.props.includesTime ? fnsDateTimeInputFormat : fnsDateInputFormat
    }

    get momentFormat() {
        return this.props.includesTime ? dateTimeInputFormat : dateInputFormat
    }

    onChange = (date: Date | null) => {
        const myMoment = date ? parseJsDateIgnoringTimeZone(date, this.timeZone) : null

        this.props.onChange({
            moment: myMoment ? myMoment : undefined,
            raw: $('#' + this.id).val() as string
        })
    }

    // When the user clicks away, set raw to the formatted moment. This "corrects" the
    // raw string when the user has typed a partial date.
    //
    // For example, user types '12/1' and
    //
    //     this.props.value = { moment: moment('12/1/2001'), raw: '12/1' }
    //
    // which is considered invalid because moment and raw are different. This onBlur function
    // will set raw to '12/1/2001', making the input valid. We only do this on blur because otherwise
    // the input will rapidly change between valid and invalid as the user types.
    onBlur = () => {
        const myMoment = this.props.value.moment

        this.props.onChange({
            moment: myMoment,
            raw: myMoment ? myMoment.format(this.momentFormat) : ''
        })
    }

    onChangeRaw = (e: React.SyntheticEvent<any>) => {
        let raw = e.currentTarget.value

        // Don't use strict parsing, because it will reject partial datetimes
        const myMoment = moment.tz(raw.trim(), this.momentFormat, this.timeZone)

        this.props.onChange({
            moment: myMoment.isValid() ? myMoment : undefined,
            raw
        })
    }

    render() {
        const {
            showValidation,
            name,
            placeholder,
            popperPlacement,
            value,
            valid,
            invalidFeedback,
            enabled,
            includesTime,
            timeIntervals,
            showPicker,
            readOnly
        } = this.props

        const classes = ['form-control', getValidationClass(valid, showValidation)]

        if (this.props.className) classes.push(this.props.className)

        const className = classes.join(' ')

        return (
            <ValidationFeedback
                valid={valid}
                showValidation={showValidation}
                invalidFeedback={invalidFeedback}
            >
                {showPicker && (
                    <DatePicker
                        id={this.id}
                        name={name}
                        selected={
                            value.moment
                                ? convertJsDateToTimeZone(
                                      value.moment.toDate(),
                                      this.timeZone
                                  )
                                : null
                        }
                        onChange={this.onChange as any}
                        onChangeRaw={this.onChangeRaw}
                        onBlur={this.onBlur}
                        className={className}
                        dateFormat={this.fnsFormat}
                        placeholderText={placeholder}
                        popperPlacement={popperPlacement}
                        disabledKeyboardNavigation
                        showTimeSelect={includesTime}
                        timeIntervals={timeIntervals}
                        timeFormat={timeFormat}
                        disabled={!enabled}
                        readOnly={readOnly}
                    />
                )}
                {!showPicker && (
                    <div className="date-input-no-picker-wrapper">
                        <input
                            id={this.id}
                            name={name}
                            value={value ? value.raw : ''}
                            onChange={this.onChangeRaw}
                            className={className}
                            placeholder={placeholder}
                            disabled={!enabled}
                            readOnly={readOnly}
                        />
                    </div>
                )}
            </ValidationFeedback>
        )
    }
}

const DateInputWithValidation = withValidation<DateInputOwnProps, DateInputValue>({
    defaultValue: defaultDateInputValue
})(_DateInput)

/***** Validators *****/

// Having the same invalid feedback for formatValidator and requiredValidator is a little weird,
// but I can't think of anything better.
function getInvalidFeedback(includesTime: boolean) {
    let invalidFeedback = 'You must enter a valid date (MM/DD/YYYY).'
    if (includesTime) {
        invalidFeedback = 'You must enter a valid date and time.'
    }

    return invalidFeedback
}

function formatValidator(includesTime: boolean = false): Validator<DateInputValue> {
    return (v: DateInputValue) => {
        let valid = false

        if (v.moment && v.moment.isValid()) {
            const format = includesTime ? dateTimeInputFormat : dateInputFormat

            // This check prevents the input from frequently changing between valid and invalid as the user types
            // (that would be annoying because the color changes and the validation feedback appears and disappears)
            if (moment(v.raw.trim(), format, true).isValid()) {
                valid = true
            }
        } else if (v.raw.length === 0) {
            valid = true
        }

        return {
            valid,
            invalidFeedback: getInvalidFeedback(includesTime)
        }
    }
}

export function DateInput(
    props: WithValidationProps<DateInputValue> & DateInputOwnProps
) {
    const validators = [formatValidator(props.includesTime)].concat(props.validators)
    return <DateInputWithValidation {...props} validators={validators} />
}

interface RequiredOptions {
    includesTime: boolean
}

function required(
    options: RequiredOptions = { includesTime: false }
): Validator<DateInputValue> {
    return (v: DateInputValue) => ({
        valid: !!v.moment && v.moment.isValid(),
        invalidFeedback: getInvalidFeedback(options.includesTime)
    })
}

export const DateValidators = {
    required
}
