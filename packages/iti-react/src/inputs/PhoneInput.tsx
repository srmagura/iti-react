import React from 'react'
import { templateParser, parseDigit } from 'input-format'

// eslint-disable-next-line import/no-extraneous-dependencies
import ReactInput from 'input-format/react'
import {
    useControlledValue,
    UseValidationProps,
    useValidation,
    Validator,
    normalizePhoneNumber,
    AdvancedPhoneNumberUtil,
} from '@interface-technologies/iti-react-core'
import { getValidationClass, ValidationFeedback } from '../validation'

const { template, lenWithCountryCode, visibleLen, formatter } = AdvancedPhoneNumberUtil

// eslint-disable-next-line
const parser = templateParser(template, parseDigit)

/** Validates a phone number. Automatically used by [[`PhoneInput`]]. */
export const phoneInputValidator: Validator<string> = (value: string) => {
    if (value && normalizePhoneNumber(value).length !== lenWithCountryCode)
        return `The phone number must have exactly ${visibleLen} digits.`

    return undefined
}

export interface PhoneInputProps extends UseValidationProps<string> {
    id?: string
    inputAttributes?: React.HTMLProps<HTMLInputElement>
    enabled?: boolean
}

/**
 * A validated phone number input. It automatically adds the US/Canada country code (1)
 * to the value. Other country codes are not currently supported.
 *
 * You don't have to pass in a validator that checks that the phone number is valid —
 * this is done automatically. `PhoneInput` can be used with `Validators.required()`.
 */
export function PhoneInput({
    id,
    showValidation,
    enabled = true,
    name,
    inputAttributes = {},
    ...props
}: PhoneInputProps): React.ReactElement {
    const { value, onChange: _onChange } = useControlledValue<string>({
        value: props.value,
        onChange: props.onChange,
        defaultValue: props.defaultValue,
        fallbackValue: '',
    })

    function onChange(newValue: string | undefined): void {
        _onChange(newValue ? normalizePhoneNumber(newValue) : '')
    }

    const validatorOutput = useValidation<string>({
        value,
        name,
        onValidChange: props.onValidChange,
        validators: [phoneInputValidator, ...props.validators],
        validationKey: props.validationKey,
        asyncValidator: props.asyncValidator,
        onAsyncError: props.onAsyncError,
        formLevelValidatorOutput: props.formLevelValidatorOutput,
    })

    const normalized = normalizePhoneNumber(value)

    let noCountryCode = normalized
    if (normalized.length > 0) {
        noCountryCode = normalized.substring(1)
    }

    return (
        <ValidationFeedback
            validatorOutput={validatorOutput}
            showValidation={showValidation}
        >
            <input name={name} value={normalized} type="hidden" />
            <ReactInput
                id={id}
                name={`${name}__display`}
                disabled={!enabled}
                onChange={onChange}
                value={noCountryCode}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                parse={parser}
                format={formatter}
                className={`form-control ${getValidationClass(
                    !validatorOutput,
                    showValidation
                )}`}
                {...inputAttributes}
            />
        </ValidationFeedback>
    )
}
