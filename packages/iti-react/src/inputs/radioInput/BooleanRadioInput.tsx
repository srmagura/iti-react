import React from 'react'
import {
    UseValidationProps,
    Validators,
    Validator,
    AsyncValidator,
} from '@interface-technologies/iti-react-core'
import { RadioInput, RadioButtonOptions } from './RadioInput'
import { RadioInputValue } from './radioInputTypes'

export type BooleanRadioInputValue = boolean | null

function convertValue(
    value: BooleanRadioInputValue | undefined
): string | undefined | null {
    if (typeof value === 'undefined') return undefined

    if (value === null) return null

    return value.toString()
}

function convertValidator(
    validator: Validator<BooleanRadioInputValue>
): Validator<RadioInputValue> {
    return (value) => {
        const booleanValue = value !== null ? value === true.toString() : null
        return validator(booleanValue)
    }
}

function convertAsyncValidator(
    validator: AsyncValidator<BooleanRadioInputValue>
): AsyncValidator<RadioInputValue> {
    return (value) => {
        const booleanValue = value !== null ? value === true.toString() : null
        return validator(booleanValue)
    }
}

export interface BooleanRadioInputProps
    extends UseValidationProps<BooleanRadioInputValue> {
    labels?: {
        false: string
        true: string
    }
    trueFirst?: boolean

    enabled?: boolean
    buttonOptions?: Partial<RadioButtonOptions>
}

/**
 * Wrapper around [[`RadioInput`]] for when there are only two options, true and false.
 */
export function BooleanRadioInput({
    trueFirst = true,
    value,
    onChange,
    defaultValue,
    validators,
    labels = { false: 'No', true: 'Yes' },
    asyncValidator,
    ...passThroughProps
}: BooleanRadioInputProps): React.ReactElement {
    const options = [
        { value: true.toString(), label: labels.true },
        { value: false.toString(), label: labels.false },
    ]

    if (!trueFirst) options.reverse()

    return (
        <RadioInput
            options={options}
            value={convertValue(value)}
            defaultValue={convertValue(defaultValue)}
            onChange={(value): void => {
                if (onChange) onChange(value === true.toString())
            }}
            validators={validators.map(convertValidator)}
            asyncValidator={
                asyncValidator ? convertAsyncValidator(asyncValidator) : undefined
            }
            {...passThroughProps}
        />
    )
}

//
//
//

function required(): Validator<BooleanRadioInputValue> {
    return (value) => {
        if (value === null) return Validators.required()('')

        return undefined
    }
}

export const BooleanRadioValidators = {
    required,
}
