import React, { useRef } from 'react'
import moment from 'moment-timezone'
import DatePicker from 'react-datepicker'
import Popper from '@popperjs/core'
import {
    getGuid,
    Validator,
    UseValidationProps,
    useControlledValue,
    useValidation,
} from '@interface-technologies/iti-react-core'
import { getValidationClass, ValidationFeedback } from '../../validation'
import { getInvalidFeedback, getTimeZone, timeFormat } from './dateInputUtil'

// date-fns format strings (used by react-datepicker)
const fnsDateInputFormat = 'M/d/yyyy'
const fnsTimeFormat = 'h:mm a'
const fnsDateTimeInputFormat = `${fnsDateInputFormat} ${fnsTimeFormat}`

/** This moment doesn't have to be a specific time zone. UTC is fine, for example. */
export type DateInputValue = moment.Moment | null

/**
 * @internal
 */
export function convertJsDateToTimeZone(date: Date, timeZone: string): Date {
    const str = date.toLocaleString('en-US', { timeZone })
    return new Date(str)
}

/**
 * @internal
 *
 * The offset of `date` must correspond to the browser's time zone for this to work.
 *
 * Example:
 * - assuming DST is in effect
 * - date = 9:00 am, UTC-4 = 1:00 pm UTC
 * - timeZone = America/Los_Angeles
 * - return value = 9:00 am, UTC -7 = 4:00 pm UTC
 */
export function parseJsDateIgnoringTimeZone(date: Date, timeZone: string): moment.Moment {
    const str = date.toLocaleString('en-US')
    return moment.tz(str, 'M/D/YYYY, h:mm:ss A', timeZone)
}

//
// Validators
//

function formatValidator(includesTime: boolean): Validator<DateInputValue> {
    return (value) => {
        if (value && !value.isValid()) return getInvalidFeedback(includesTime)

        return undefined
    }
}

function required(options: { includesTime: boolean }): Validator<DateInputValue> {
    return (value) => {
        if (!value) return getInvalidFeedback(options.includesTime)

        return undefined
    }
}

/** Validators for use with [[`DateInput`]]. */
export const DateValidators = {
    required,
}

export interface DateInputProps extends UseValidationProps<DateInputValue> {
    id?: string
    placeholder?: string

    className?: string

    /**
     * This class name will be used **in addition to** `form-control` and the
     * validation feedback class.
     */
    inputClassName?: string

    popperPlacement?: Popper.Placement
    includesTime?: boolean
    timeIntervals?: number
    filterDate?(date: Date): boolean
    enabled?: boolean
    readOnly?: boolean

    /** Pass `'local'` to use `moment.tz.guess()` as the time zone */
    timeZone: string
}

/**
 * A datetime input with a datepicker popover. See also [[`DateInputNoPicker`]].
 *
 * It is implemented using `react-datepicker`.
 */
export const DateInput = React.memo<DateInputProps>(
    ({
        placeholder,
        includesTime = false,
        popperPlacement,
        timeIntervals,
        enabled = true,
        readOnly = false,
        filterDate,
        showValidation,
        name,
        className,
        ...otherProps
    }) => {
        const timeZone = getTimeZone(otherProps.timeZone)

        const idGuidRef = useRef(getGuid())
        const id = otherProps.id ?? idGuidRef.current

        const { value, onChange } = useControlledValue<DateInputValue>({
            value: otherProps.value,
            onChange: otherProps.onChange,
            defaultValue: otherProps.defaultValue,
            fallbackValue: null,
        })

        const validatorOutput = useValidation<DateInputValue>({
            value,
            name,
            onValidChange: otherProps.onValidChange,
            validators: [formatValidator(includesTime), ...otherProps.validators],
            validationKey: otherProps.validationKey,
            asyncValidator: otherProps.asyncValidator,
            onAsyncError: otherProps.onAsyncError,
            formLevelValidatorOutput: otherProps.formLevelValidatorOutput,
        })

        const fnsFormat = includesTime ? fnsDateTimeInputFormat : fnsDateInputFormat

        function datePickerOnChange(date: Date | null): void {
            const d = date ? parseJsDateIgnoringTimeZone(date, timeZone) : null
            onChange(d)
        }

        const classes = [
            'form-control',
            getValidationClass(!validatorOutput, showValidation),
        ]
        if (otherProps.inputClassName) classes.push(otherProps.inputClassName)

        return (
            <ValidationFeedback
                validatorOutput={validatorOutput}
                showValidation={showValidation}
                className={className}
            >
                <DatePicker
                    id={id}
                    name={name}
                    selected={
                        value ? convertJsDateToTimeZone(value.toDate(), timeZone) : null
                    }
                    onChange={datePickerOnChange}
                    className={classes.join(' ')}
                    dateFormat={fnsFormat}
                    placeholderText={placeholder}
                    popperPlacement={popperPlacement}
                    disabledKeyboardNavigation
                    showTimeSelect={includesTime}
                    timeIntervals={timeIntervals}
                    timeFormat={timeFormat}
                    filterDate={filterDate}
                    disabled={!enabled}
                    readOnly={readOnly}
                    autoComplete="off"
                />
            </ValidationFeedback>
        )
    }
)
