import React, { useRef, useEffect } from 'react'
import moment from 'moment-timezone'
import DatePicker from 'react-datepicker'
import {
    getGuid,
    Validator,
    UseValidationProps,
    useControlledValue,
    useValidation,
    ValidatorOutput
} from '@interface-technologies/iti-react-core'
import { getValidationClass, ValidationFeedback } from '../Validation'

// MomentJS format strings
export const dateInputFormat = 'M/D/YYYY'
const timeFormat = 'h:mm a'
export const dateTimeInputFormat = `${dateInputFormat} ${timeFormat}`

// Equivalent date-fns format strings (used by react-datepicker)
export const fnsDateInputFormat = 'M/d/yyyy'
const fnsTimeFormat = 'h:mm a'
export const fnsDateTimeInputFormat = `${fnsDateInputFormat} ${fnsTimeFormat}`

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

//
// Validators
//

function getInvalidFeedback(includesTime: boolean): string {
    let invalidFeedback = 'You must enter a valid date (MM/DD/YYYY).'
    if (includesTime) {
        invalidFeedback = 'You must enter a valid date and time.'
    }

    return invalidFeedback
}

function formatValidator(includesTime = false): Validator<DateInputValue> {
    return (v: DateInputValue): ValidatorOutput => {
        let valid = false

        if (v.moment && v.moment.isValid()) {
            const format = includesTime ? dateTimeInputFormat : dateInputFormat

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

interface RequiredOptions {
    includesTime: boolean
}

function required(
    options: RequiredOptions = { includesTime: false }
): Validator<DateInputValue> {
    return (v: DateInputValue): ValidatorOutput => ({
        valid: !!v.moment && v.moment.isValid(),
        invalidFeedback: getInvalidFeedback(options.includesTime)
    })
}

export const DateValidators = {
    required
}

//
// DateInput component
//

interface DateInputProps extends UseValidationProps<DateInputValue> {
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

export function DateInput({
    placeholder,
    includesTime,
    popperPlacement,
    timeIntervals,
    enabled = true,
    showPicker = true,
    readOnly = false,
    showValidation,
    name,
    timeZone = moment.tz.guess(),
    ...otherProps
}: DateInputProps): React.ReactElement {
    const idRef = useRef(otherProps.id ?? getGuid())
    useEffect(() => {
        if (otherProps.id && otherProps.id !== idRef.current) {
            idRef.current = otherProps.id
        }
    })

    const { value, onChange: _onChange } = useControlledValue<DateInputValue>({
        value: otherProps.value,
        onChange: otherProps.onChange,
        defaultValue: otherProps.defaultValue,
        fallbackValue: defaultDateInputValue
    })

    const { valid, invalidFeedback, asyncValidationInProgress } = useValidation<
        DateInputValue
    >({
        value,
        name,
        onValidChange: otherProps.onValidChange,
        validators: [formatValidator(includesTime), ...otherProps.validators],
        validationKey: otherProps.validationKey,
        asyncValidator: otherProps.asyncValidator,
        onAsyncError: otherProps.onAsyncError,
        onAsyncValidationInProgressChange: otherProps.onAsyncValidationInProgressChange,
        formLevelValidatorOutput: otherProps.formLevelValidatorOutput
    })

    const fnsFormat = includesTime ? fnsDateTimeInputFormat : fnsDateInputFormat
    const momentFormat = includesTime ? dateTimeInputFormat : dateInputFormat

    function onChange(date: Date | null): void {
        const myMoment = date ? parseJsDateIgnoringTimeZone(date, timeZone) : null

        _onChange({
            moment: myMoment || undefined,
            raw: myMoment ? myMoment.format(momentFormat) : ''
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
    function onBlur(): void {
        const myMoment = value.moment

        _onChange({
            moment: myMoment,
            raw: myMoment ? myMoment.format(momentFormat) : ''
        })
    }

    function onChangeRaw(e: React.FocusEvent<HTMLInputElement>): void {
        const raw = e.currentTarget.value

        // Don't use strict parsing, because it will reject partial datetimes
        const myMoment = moment.tz(raw.trim(), momentFormat, timeZone)

        _onChange({
            moment: myMoment.isValid() ? myMoment : undefined,
            raw
        })
    }

    const classes = ['form-control', getValidationClass(valid, showValidation)]
    if (otherProps.className) classes.push(otherProps.className)

    const className = classes.join(' ')

    return (
        <ValidationFeedback
            valid={valid}
            showValidation={showValidation}
            invalidFeedback={invalidFeedback}
            asyncValidationInProgress={asyncValidationInProgress}
        >
            {showPicker && (
                <DatePicker
                    id={idRef.current}
                    name={name}
                    selected={
                        value.moment
                            ? convertJsDateToTimeZone(value.moment.toDate(), timeZone)
                            : null
                    }
                    onChange={onChange}
                    onChangeRaw={onChangeRaw}
                    onBlur={onBlur}
                    className={className}
                    dateFormat={fnsFormat}
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
                        id={idRef.current}
                        name={name}
                        value={value ? value.raw : ''}
                        onChange={onChangeRaw}
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
