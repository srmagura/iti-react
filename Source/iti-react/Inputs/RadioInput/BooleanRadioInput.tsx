import * as React from 'react'
import { WithValidationProps, Validators, Validator } from '../..'
import { RadioInput, RadioInputValue } from './RadioInput'

export type BooleanRadioInputValue = boolean | null

interface ILabels {
    false: string
    true: string
}

interface BooleanRadioInputProps {
    enabled?: boolean
    labels?: ILabels

    // The remaining props are based off of WithValidationProps
    name: string
    value?: BooleanRadioInputValue
    defaultValue?: BooleanRadioInputValue
    onChange?: (value: BooleanRadioInputValue) => void

    showValidation: boolean
    onValidChange?: (name: string, valid: boolean) => void

    validators: Validator<BooleanRadioInputValue>[]
    validationKey?: string | number
}

export const BooleanRadioInput: React.SFC<BooleanRadioInputProps> = props => {
    const {
        enabled,
        value,
        onChange,
        defaultValue,
        validators,
        ...passThroughProps
    } = props
    const labels = props.labels as ILabels

    const options = [
        { value: true.toString(), label: labels.true },
        { value: false.toString(), label: labels.false }
    ]

    function convertValue(value: BooleanRadioInputValue | undefined) {
        if (typeof value === 'undefined') return undefined

        if (value === null) return null

        return value.toString()
    }

    function convertValidator(
        validator: Validator<BooleanRadioInputValue>
    ): Validator<RadioInputValue> {
        return (value: RadioInputValue) => {
            const booleanValue = value !== null ? value === true.toString() : null
            return validator(booleanValue)
        }
    }

    return (
        <RadioInput
            enabled={enabled}
            options={options}
            value={convertValue(value)}
            defaultValue={convertValue(defaultValue)}
            onChange={value => {
                if (onChange) onChange(value === true.toString())
            }}
            validators={validators.map(convertValidator)}
            {...passThroughProps}
        />
    )
}

BooleanRadioInput.defaultProps = {
    labels: { false: 'No', true: 'Yes' }
}

function required(): Validator<BooleanRadioInputValue> {
    return (value: BooleanRadioInputValue) => ({
        valid: value !== null,
        invalidFeedback: Validators.required()('').invalidFeedback
    })
}

export const BooleanRadioValidators = {
    required
}
