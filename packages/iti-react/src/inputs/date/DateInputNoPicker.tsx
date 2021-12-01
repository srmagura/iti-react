import React, { useRef } from 'react'
import moment from 'moment-timezone'
import {
    getGuid,
    Validator,
    UseValidationProps,
    useControlledValue,
    useValidation,
} from '@interface-technologies/iti-react-core'
import { getValidationClass, ValidationFeedback } from '../../validation'
import {
    dateInputFormat,
    dateTimeInputFormat,
    getInvalidFeedback,
    getTimeZone,
} from './dateInputUtil'

/**
 * Get the initial value for a [[`DateInputNoPicker`]] component.
 *
 * @param timeZone an IANA time zone or `'local'`, which will use `moment.tz.guess()` as
 * the time zone.
 * @returns a formatted date string or `''` if the input moment was invalid
 */
export function formatDateInputNoPickerValue(
    m: moment.Moment,
    options: { includesTime: true; timeZone: string } | { includesTime: false }
): string {
    if (!(m && m.isValid())) return ''

    if (!options.includesTime) return moment.utc(m).format(dateInputFormat)

    const timeZone = getTimeZone(options.timeZone)
    return moment(m).tz(timeZone).format(dateTimeInputFormat)
}

function parseValueCore(
    value: string,
    options: { includesTime: true; timeZone: string } | { includesTime: false }
): moment.Moment {
    // strict = true. Otherwise strings like "5" are considered valid.

    if (!options.includesTime)
        return moment.utc(value.trim(), dateInputFormat, true).startOf('day')

    const timeZone = getTimeZone(options.timeZone)
    return moment.tz(value.trim(), dateTimeInputFormat, true, timeZone)
}

/**
 * Parse the `value` of a [[`DateInputNoPicker`]] component.
 *
 * @param timeZone an IANA time zone or `'local'`, which will use `moment.tz.guess()` as
 * the time zone.
 * @returns a Moment object or undefined if the `value` was invalid
 */
export function parseDateInputNoPickerValue(
    value: string,
    options: { includesTime: true; timeZone: string } | { includesTime: false }
): moment.Moment | undefined {
    if (typeof value !== 'string') return undefined

    const d = parseValueCore(value, options)
    return d.isValid() ? d : undefined
}

//
// Validators
//

function isValid(value: string, includesTime: boolean): boolean {
    return parseValueCore(value, { includesTime, timeZone: 'Etc/UTC' }).isValid()
}

function formatValidator(includesTime: boolean): Validator<string> {
    return (value) => {
        if (value && !isValid(value, includesTime))
            return getInvalidFeedback(includesTime)

        return undefined
    }
}

function required(options: { includesTime: boolean }): Validator<string> {
    return (value) => {
        if (!value) return getInvalidFeedback(options.includesTime)

        return undefined
    }
}

/** Validators for use with `DateInputNoPicker`. */
export const DateInputNoPickerValidators = {
    required,
}

export interface DateInputNoPickerProps extends UseValidationProps<string> {
    id?: string
    placeholder?: string

    /** This class name will be used *in addition to* form-control and the validation feedback class */
    className?: string

    includesTime?: boolean
    enabled?: boolean
    readOnly?: boolean
}

/**
 * A datetime input without a datepicker popover. Its value is just a `string`.
 * Good for things like date of birth. See also [[`DateInput`]].
 *
 * Use [[`formatDateInputNoPickerValue`]] to get the initial value for this input.
 *
 * Use [[`parseDateInputNoPickerValue`]] to get a `moment`
 * object from the string.
 */
export const DateInputNoPicker = React.memo<DateInputNoPickerProps>(
    ({
        placeholder,
        includesTime = false,
        enabled = true,
        readOnly = false,
        showValidation,
        name,
        ...otherProps
    }) => {
        const idGuidRef = useRef(getGuid())
        const id = otherProps.id ?? idGuidRef.current

        const { value, onChange } = useControlledValue<string>({
            value: otherProps.value,
            onChange: otherProps.onChange,
            defaultValue: otherProps.defaultValue,
            fallbackValue: '',
        })

        const validatorOutput = useValidation<string>({
            value,
            name,
            onValidChange: otherProps.onValidChange,
            validators: [formatValidator(includesTime), ...otherProps.validators],
            validationKey: otherProps.validationKey,
            asyncValidator: otherProps.asyncValidator,
            onAsyncError: otherProps.onAsyncError,
            formLevelValidatorOutput: otherProps.formLevelValidatorOutput,
        })

        const classes = [
            'form-control',
            getValidationClass(!validatorOutput, showValidation),
        ]
        if (otherProps.className) classes.push(otherProps.className)

        const className = classes.join(' ')

        return (
            <ValidationFeedback
                validatorOutput={validatorOutput}
                showValidation={showValidation}
            >
                <input
                    id={id}
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={className}
                    placeholder={placeholder}
                    disabled={!enabled}
                    readOnly={readOnly}
                    autoComplete="off"
                />
            </ValidationFeedback>
        )
    }
)
