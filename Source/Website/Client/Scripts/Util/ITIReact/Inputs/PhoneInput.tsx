import * as React from 'react';
import * as moment from 'moment';
import { templateFormatter, templateParser, ReactInput, parseDigit } from 'input-format';

import { getValidationClass, ValidationFeedback, Validator } from '../Validation';
import { IInjectedProps, withValidation, IWithValidationProps } from '../Validation/WithValidation';

/* This code should handle a variety of US phone number formats:
 * - with or without country code 1
 * - with or without leading +
 * - less than the required number of digits
 * - with or without punctuation
 */

const visibleLen = 10
const lenWithCountryCode = visibleLen + 1

function normalizePhoneNumber(phoneNumber: string) {
    let num = phoneNumber.replace(/[^0-9]/g, '')

    if (num.length > 0 && num[0] !== '1')
        num = '1' + num

    if (num.length > lenWithCountryCode) {
        num = num.substring(0, lenWithCountryCode)
    }

    return num
}

const template = '(xxx) xxx-xxxx'
const parser = templateParser(template, parseDigit)
const formatter = templateFormatter(template)

export function formatPhoneNumber(phoneNumber: string) {
    if (!phoneNumber)
        return ''

    const normalized = normalizePhoneNumber(phoneNumber)
    let noCountry = normalized
    if (noCountry.length > 0 && noCountry[0] === '1') {
        noCountry = noCountry.substring(1)
    }

    return formatter(noCountry).text
}

interface IPhoneInputOwnProps extends React.Props<any> {
    name: string
    inputAttributes?: object
}

type IPhoneInputProps = IPhoneInputOwnProps & IInjectedProps

export class _PhoneInput extends React.Component<IPhoneInputProps, {}> {

    static defaultProps = {
        inputAttributes: {}
    }

    onChange: (newValue: string | undefined) => void = newValue => {
        const { onChange } = this.props

        newValue = newValue ? normalizePhoneNumber(newValue) : ''
        onChange(newValue)
    }

    render() {
        const { value, valid, invalidFeedback, showValidation, name, inputAttributes } = this.props

        const normalized = normalizePhoneNumber(value)

        let noCountryCode = normalized
        if (normalized.length > 0) {
            noCountryCode = normalized.substring(1)
        }

        return <ValidationFeedback showValidation={showValidation}
            valid={valid}
            invalidFeedback={invalidFeedback}>
            <input name={name} value={normalized} type="hidden" />
            <ReactInput
                name={name + '__display'}
                onChange={this.onChange}
                value={noCountryCode}
                parse={parser}
                format={formatter}
                className={'form-control ' + getValidationClass(valid, showValidation)}
                {...inputAttributes} />
        </ValidationFeedback>
    }
}

const PhoneInputWithValidation = withValidation<IPhoneInputOwnProps>({ defaultValue: '' })(_PhoneInput)

const phoneNumberValidator: Validator<string> = (value: string) => ({
    valid: !value || normalizePhoneNumber(value).length === lenWithCountryCode,
    invalidFeedback: `The phone number must have exactly ${visibleLen} digits.`
})

export function PhoneInput(props: IWithValidationProps<string> & IPhoneInputOwnProps) {
    const validators = [phoneNumberValidator].concat(props.validators)
    return <PhoneInputWithValidation {...props}
        validators={validators} />
}