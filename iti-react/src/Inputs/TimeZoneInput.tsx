﻿import React from 'react'
import { getTimeZones } from '@vvo/tzdb'
import {
    Validator,
    Validators,
    ValidatorOutput,
    UseValidationProps,
    useControlledValue,
    useValidation,
} from '@interface-technologies/iti-react-core'
import { SelectValue, ValidatedSelect } from './Select'

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

function convertValidator(
    validator: Validator<TimeZoneInputValue>
): Validator<SelectValue> {
    return (value: SelectValue) => {
        if (typeof value === 'number')
            throw new Error('Time zone validator received a number.')

        return validator(value)
    }
}

interface TimeZoneInputProps extends UseValidationProps<TimeZoneInputValue> {
    id?: string
    name: string
    placeholder?: string
    isClearable?: boolean
    width?: number
}

export function TimeZoneInput({
    id,
    name,
    placeholder,
    isClearable,
    width,
    validators,
    showValidation,
    ...props
}: TimeZoneInputProps): React.ReactElement {
    const { value, onChange } = useControlledValue<TimeZoneInputValue>({
        value: props.value,
        onChange: props.onChange,
        defaultValue: props.defaultValue,
        fallbackValue: null,
    })

    useValidation<TimeZoneInputValue>({
        value,
        name,
        onValidChange: props.onValidChange,
        validators,
        validationKey: props.validationKey,
        asyncValidator: props.asyncValidator,
        onAsyncError: props.onAsyncError,
        onAsyncValidationInProgressChange: props.onAsyncValidationInProgressChange,
        formLevelValidatorOutput: props.formLevelValidatorOutput,
    })

    return (
        <ValidatedSelect
            id={id}
            name={name}
            options={options}
            validators={validators.map(convertValidator)}
            onChange={onChange}
            showValidation={showValidation}
            placeholder={placeholder}
            width={width}
            isClearable={isClearable}
        />
    )
}

function required(): Validator<TimeZoneInputValue> {
    return (value: TimeZoneInputValue): ValidatorOutput => ({
        valid: value !== null,
        invalidFeedback: Validators.required()('').invalidFeedback,
    })
}

export const TimeZoneValidators = {
    required,
}
