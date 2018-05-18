import * as React from 'react';
import * as moment from 'moment';
import DatePicker from 'react-datepicker';

import { getValidationClass, ValidationFeedback, Validator, getCombinedValidatorOutput } from '../Validation';

export const dateFormat = 'M/D/YYYY'

interface IDateInputProps extends React.Props<any> {
    name: string

    value?: moment.Moment
    onChange?: (momentValue?: moment.Moment) => void
    defaultValue?: moment.Moment

    showValidation: boolean
    onValidChange?: (valid: boolean) => void

    validators: Validator<string>[]

    placeholder?: string
    popperPlacement?: string
}

interface IDateInputState {
    value?: moment.Moment,
    controlled: boolean
}

export class DateInput extends React.Component<IDateInputProps, IDateInputState> {

    constructor(props: IDateInputProps) {
        super(props)

        let value
        if (props.value) {
            value = props.value
        } else if (props.defaultValue) {
            value = props.defaultValue
        }

        this.state = {
            value,
            controlled: typeof props.value !== 'undefined'
        }
    }

    componentDidMount() {
        const { onValidChange } = this.props;

        if (onValidChange) {
            onValidChange(this.getValidationOutput(this.state.value).valid)
        }
    }

    static getDerivedStateFromProps(nextProps: IDateInputProps, prevState: IDateInputState) {
        if (prevState.controlled || typeof nextProps.value !== 'undefined') {
            return {
                value: nextProps.value,
                controlled: true,
            }
        }

        return {}
    }

    private getValidationOutput(value?: moment.Moment) {
        const formatValidator = (v: string) => ({
            valid: !v || !value || value.isValid(),
            invalidFeedback: 'You must enter a valid date (MM/DD/YYYY).'
        })

        const validators = this.props.validators.concat([formatValidator])

        const stringValue = value ? value.format(dateFormat) : ''
        return getCombinedValidatorOutput(stringValue, validators)
    }

    onChange = (value: moment.Moment) => {
        const { onChange, onValidChange } = this.props

        if (onValidChange)
            onValidChange(this.getValidationOutput(value).valid)

        // do this before calling onChange in case this is a controlled component
        this.setState(s => ({ ...s, value }))

        if (onChange)
            onChange(value)
    }

    render() {
        const { showValidation, name, placeholder, popperPlacement } = this.props
        const { value } = this.state

        const { valid, invalidFeedback } = this.getValidationOutput(value)

        const className = 'form-control ' + getValidationClass(valid, showValidation)

        return <ValidationFeedback valid={valid} showValidation={showValidation} invalidFeedback={invalidFeedback}>
            <DatePicker
                name={name}
                selected={value}
                onChange={this.onChange}
                className={className}
                dateFormat={dateFormat}
                placeholderText={placeholder}
                popperPlacement={popperPlacement}
                disabledKeyboardNavigation
            />
        </ValidationFeedback>
    }
}