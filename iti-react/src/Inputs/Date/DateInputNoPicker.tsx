import React, { useRef } from 'react'
import dayjs from 'dayjs'
import {
    getGuid,
    Validator,
    UseValidationProps,
    useControlledValue,
    useValidation,
} from '@interface-technologies/iti-react-core'
import { getValidationClass, ValidationFeedback } from '../../Validation'
import { getDateInputFormat, getInvalidFeedback, getTimeZone } from './DateInputUtil'

function parseValueCore(
    value: string,
    options: { includesTime: boolean; timeZone: string }
): dayjs.Dayjs {
    const format = getDateInputFormat(options.includesTime)
    const timeZone = getTimeZone(options.timeZone)

    // Don't use strict parsing, because it will reject partial datetimes
    return dayjs.tz(value.trim(), format, timeZone)
}

/**
 * Parse the `value` of a [[`DateInputNoPicker`]] component.
 *
 * @param timeZone an IANA time zone or `'local'`, which will use `dayjs.tz.guess()` as
 * the time zone.
 * @returns a Day.js object or undefined if the `value` was invalid
 */
export function parseDateInputNoPickerValue(
    value: string,
    options: { includesTime: boolean; timeZone: string }
): dayjs.Dayjs | undefined {
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
    return (value) => ({
        valid: !value || isValid(value, includesTime),
        invalidFeedback: getInvalidFeedback(includesTime),
    })
}

interface RequiredOptions {
    includesTime: boolean
}

function required(options: RequiredOptions = { includesTime: false }): Validator<string> {
    return (value) => ({
        valid: !!value && isValid(value, options.includesTime),
        invalidFeedback: getInvalidFeedback(options.includesTime),
    })
}

export const DateNoPickerValidators = {
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
    timeZone: string
}

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

        const { valid, invalidFeedback, asyncValidationInProgress } =
            useValidation<string>({
                value,
                name,
                onValidChange: otherProps.onValidChange,
                validators: [formatValidator(includesTime), ...otherProps.validators],
                validationKey: otherProps.validationKey,
                asyncValidator: otherProps.asyncValidator,
                onAsyncError: otherProps.onAsyncError,
                onAsyncValidationInProgressChange:
                    otherProps.onAsyncValidationInProgressChange,
                formLevelValidatorOutput: otherProps.formLevelValidatorOutput,
            })

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
