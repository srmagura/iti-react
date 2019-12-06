import React from 'react'
import { templateParser, ReactInput, parseDigit } from 'input-format'
import { getValidationClass, ValidationFeedback } from '../Validation'
import {
    WithValidationInjectedProps,
    withValidation,
    WithValidationProps
} from '../Validation/WithValidation'
import { Validator } from '@interface-technologies/iti-react-core'
import {
    template,
    formatter,
    normalizePhoneNumber,
    lenWithCountryCode,
    visibleLen
} from '@interface-technologies/iti-react-core/Util/PhoneNumberUtil'

const parser = templateParser(template, parseDigit)

interface PhoneInputOwnProps {
    id?: string
    inputAttributes?: object
}

type PhoneInputProps = PhoneInputOwnProps & WithValidationInjectedProps

export class _PhoneInput extends React.Component<PhoneInputProps, {}> {
    static defaultProps = {
        inputAttributes: {}
    }

    onChange: (newValue: string | undefined) => void = newValue => {
        const { onChange } = this.props

        newValue = newValue ? normalizePhoneNumber(newValue) : ''
        onChange(newValue)
    }

    render() {
        const {
            id,
            value,
            valid,
            invalidFeedback,
            showValidation,
            name,
            inputAttributes
        } = this.props

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
            >
                <input name={name} value={normalized} type="hidden" />
                <ReactInput
                    id={id}
                    name={name + '__display'}
                    onChange={this.onChange}
                    value={noCountryCode}
                    parse={parser}
                    format={formatter}
                    className={
                        'form-control ' + getValidationClass(valid, showValidation)
                    }
                    {...inputAttributes}
                />
            </ValidationFeedback>
        )
    }
}

const PhoneInputWithValidation = withValidation<PhoneInputOwnProps>({
    defaultValue: ''
})(_PhoneInput)

export const phoneInputValidator: Validator<string> = (value: string) => ({
    valid: !value || normalizePhoneNumber(value).length === lenWithCountryCode,
    invalidFeedback: `The phone number must have exactly ${visibleLen} digits.`
})

export function PhoneInput(props: WithValidationProps<string> & PhoneInputOwnProps) {
    const validators = [phoneInputValidator].concat(props.validators)
    return <PhoneInputWithValidation {...props} validators={validators} />
}
