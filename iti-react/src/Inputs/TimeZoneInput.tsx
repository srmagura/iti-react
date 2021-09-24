import React, { useEffect, useRef } from 'react'
import { getTimeZones } from '@vvo/tzdb'
import {
    Validator,
    Validators,
    ValidatorOutput,
    UseValidationProps,
    useControlledValue,
    AsyncValidator,
} from '@interface-technologies/iti-react-core'
import { SelectValue, ValidatedSelect } from './Select'

export type TimeZoneInputValue = string | null

interface CommonTimeZone {
    ianaTimeZone: string
    displayName: string
}

/* Not including the zone abbreviation (e.g. EST / EDT ). This becomes a huge pain in
 * the ass since the abbreviation depends on the current date. */
const commonTimeZones: CommonTimeZone[] = [
    {
        ianaTimeZone: 'America/New_York',
        displayName: 'Eastern Time',
    },
    {
        ianaTimeZone: 'America/Chicago',
        displayName: 'Central Time',
    },
    {
        ianaTimeZone: 'America/Denver',
        displayName: 'Mountain Time',
    },
    {
        ianaTimeZone: 'America/Los_Angeles',
        displayName: 'Pacific Time',
    },
]

const usOptions = commonTimeZones.map((o) => ({
    value: o.ianaTimeZone,
    label: o.displayName,
}))

const advancedOptions = getTimeZones()
    .map((o) => ({
        value: o.name,
        label: o.rawFormat,
    }))
    .filter((o) => !usOptions.find((oo) => o.value === oo.value))

const options = [
    { label: 'US time zones', options: usOptions },
    { label: 'All time zones', options: advancedOptions },
]

const allOptions = [...usOptions, ...advancedOptions]
const optionValueSet = new Set<string>(allOptions.map((o) => o.value))

/**
 * @internal
 *
 * Because tzdb groups time zones, there isn't a SelectOption for every IANA time zone.
 * This function converts the value to a time zone that has an option.
 */
export function resolveValue(
    value: TimeZoneInputValue,
    onChange: (value: TimeZoneInputValue) => void
): void {
    if (value && !optionValueSet.has(value)) {
        const timeZone = getTimeZones().find((tz) => tz.group.includes(value))
        if (timeZone) onChange(timeZone.name)
    }
}

function convertValidator(
    validator: Validator<TimeZoneInputValue>
): Validator<SelectValue> {
    return (value: SelectValue) => {
        if (typeof value === 'number')
            throw new Error('Time zone validator received a number.')

        return validator(value)
    }
}

function convertAsyncValidator(
    validator: AsyncValidator<TimeZoneInputValue>
): AsyncValidator<SelectValue> {
    return (value: SelectValue) => {
        if (typeof value === 'number')
            throw new Error('Time zone async validator received a number.')

        return validator(value)
    }
}

export interface TimeZoneInputProps extends UseValidationProps<TimeZoneInputValue> {
    id?: string
    name: string
    placeholder?: string
    formControlSize?: 'sm' | 'lg'
    isClearable?: boolean
    width?: number
    enabled?: boolean
}

/**
 * A time zone dropdown. The 4 common US time zones are shown first, followed by every
 * other time zone. It uses the `@vvo/tzdb` time zone database.
 */
export function TimeZoneInput({
    id,
    name,
    placeholder,
    formControlSize,
    isClearable,
    width,
    validators,
    showValidation,
    enabled = true,
    asyncValidator,
    onAsyncError,
    onValidChange,
    validationKey,
    ...props
}: TimeZoneInputProps): React.ReactElement {
    const { value, onChange } = useControlledValue<TimeZoneInputValue>({
        value: props.value,
        onChange: props.onChange,
        defaultValue: props.defaultValue,
        fallbackValue: null,
    })

    const onChangeRef = useRef(onChange)

    useEffect(() => {
        onChangeRef.current = onChange
    })

    useEffect(() => {
        resolveValue(value, onChangeRef.current)
    }, [value])

    return (
        <ValidatedSelect
            id={id}
            name={name}
            options={options}
            validators={validators.map(convertValidator)}
            asyncValidator={
                asyncValidator ? convertAsyncValidator(asyncValidator) : undefined
            }
            onAsyncError={onAsyncError}
            value={value}
            onChange={onChange}
            showValidation={showValidation}
            placeholder={placeholder}
            formControlSize={formControlSize}
            width={width}
            isClearable={isClearable}
            enabled={enabled}
            onValidChange={onValidChange}
            validationKey={validationKey}
            formLevelValidatorOutput={props.formLevelValidatorOutput}
        />
    )
}

function required(): Validator<TimeZoneInputValue> {
    return (value: TimeZoneInputValue): ValidatorOutput => ({
        valid: value !== null,
        invalidFeedback: Validators.required()(''),
    })
}

export const TimeZoneValidators = {
    required,
}
