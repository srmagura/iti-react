import * as React from 'react';
import * as moment from 'moment';
import { templateFormatter, templateParser, ReactInput, parseDigit } from 'input-format';

import { getValidationClass, ValidationFeedback, ValidatedInput, Validator } from '../Validation';

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

interface IPhoneInputProps extends React.Props<any> {
    name: string

    value?: string
    onChange?: (value: string) => void
    defaultValue?: string

    showValidation: boolean
    onValidChange?: (valid: boolean) => void

    inputAttributes?: object
}

interface IPhoneInputState {
    value: string
}

export class PhoneInput extends React.Component<IPhoneInputProps, IPhoneInputState> {

    static defaultProps = {
        inputAttributes: {}
    }

    constructor(props: IPhoneInputProps) {
        super(props)

        let value
        if (typeof (props.value) !== 'undefined') {
            value = props.value
        } else if (typeof (props.defaultValue) !== 'undefined') {
            value = props.defaultValue
        } else {
            value = ''
        }

        this.state = {
            value
        }
    }

    componentDidMount() {
        this.forceValidate(this.state.value)
    }

    componentWillReceiveProps(nextProps: IPhoneInputProps) {
        if (typeof (nextProps.value) !== 'undefined' && nextProps.value !== this.state.value) {
            this.forceValidate(nextProps.value)
            this.setState({ value: nextProps.value })
        }
    }

    forceValidate(value: string) {
        const { onValidChange } = this.props

        if (onValidChange) {
            onValidChange(this.isValid(value))
        }
    }

    isValid(value: string): boolean {
        return normalizePhoneNumber(value).length === lenWithCountryCode
    }

    onChange: (newValue: string | undefined) => void = newValue => {
        const { onChange, onValidChange } = this.props

        newValue = newValue ? normalizePhoneNumber(newValue) : ''

        this.setState({ value: newValue })

        if (onChange) {
            onChange(newValue)
        }

        if (onValidChange) {
            onValidChange(this.isValid(newValue))
        }
    }

    render() {
        const { showValidation, name, inputAttributes } = this.props
        const { value } = this.state
        const valid = this.isValid(value)

        const normalized = normalizePhoneNumber(value) 

        let noCountryCode = normalized
        if (normalized.length > 0) {
            noCountryCode = normalized.substring(1)
        }

        return <ValidationFeedback showValidation={showValidation}
            valid={valid}
            invalidFeedback={`You must enter a ${visibleLen}-digit phone number.`}>
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