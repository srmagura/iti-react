import React from 'react'
import { templateParser, ReactInput, parseDigit } from 'input-format'
import {
    useControlledValue,
    UseValidationProps,
    useValidation,
    Validator
} from '@interface-technologies/iti-react-core'
import {
    template,
    formatter,
    normalizePhoneNumber,
    lenWithCountryCode,
    visibleLen
} from '@interface-technologies/iti-react-core/src/Util/PhoneNumberUtil'
import { defaults } from 'lodash'
import { getValidationClass, ValidationFeedback } from '../Validation'

const parser = templateParser(template, parseDigit)

export const phoneInputValidator: Validator<string> = (value: string) => ({
    valid: !value || normalizePhoneNumber(value).length === lenWithCountryCode,
    invalidFeedback: `The phone number must have exactly ${visibleLen} digits.`
})

interface PhoneInputProps extends UseValidationProps<string> {
    id?: string
    inputAttributes?: React.HTMLProps<HTMLInputElement>
    enabled?: boolean
}

export function PhoneInput(props: PhoneInputProps): React.ReactElement {
    const { id, showValidation, enabled, name, inputAttributes } = defaults(
        { ...props },
        { inputAttributes: {}, enabled: true }
    )

    const { value, onChange: _onChange } = useControlledValue<string>({
        value: props.value,
        onChange: props.onChange,
        defaultValue: props.defaultValue,
        fallbackValue: ''
    })

    function onChange(newValue: string | undefined): void {
        _onChange(newValue ? normalizePhoneNumber(newValue) : '')
    }

    const { valid, invalidFeedback, asyncValidationInProgress } = useValidation<string>({
        value,
        name: props.name,
        onValidChange: props.onValidChange,
        validators: [phoneInputValidator, ...props.validators],
        validationKey: props.validationKey,
        asyncValidator: props.asyncValidator,
        onAsyncError: props.onAsyncError,
        onAsyncValidationInProgressChange: props.onAsyncValidationInProgressChange,
        formLevelValidatorOutput: props.formLevelValidatorOutput
    })

    const normalized = normalizePhoneNumber(value)

    let noCountryCode = normalized
    if (normalized.length > 0) {
        noCountryCode = normalized.substring(1)
    }

    return (
        <ValidationFeedback
            showValidation={showValidation}
            valid={valid}
            invalidFeedback={invalidFeedback}
            asyncValidationInProgress={asyncValidationInProgress}
        >
            <input name={name} value={normalized} type="hidden" />
            <ReactInput
                id={id}
                name={`${name  }__display`}
                disabled={!enabled}
                onChange={onChange}
                value={noCountryCode}
                parse={parser}
                format={formatter}
                className={`form-control ${  getValidationClass(valid, showValidation)}`}
                {...inputAttributes}
            />
        </ValidationFeedback>
    )
}
