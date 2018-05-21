import * as React from 'react';
import * as moment from 'moment';
import DatePicker from 'react-datepicker';

import {
    getValidationClass, ValidationFeedback, Validator, IInjectedProps,
    withValidation, IWithValidationProps
} from '../Validation';

export const dateFormat = 'M/D/YYYY'

type TValue = moment.Moment | null

interface IDateInputOwnProps extends React.Props<any> {
    name: string
    placeholder?: string
    popperPlacement?: string
}

type IDateInputProps = IDateInputOwnProps & IInjectedProps<TValue>

class _DateInput extends React.Component<IDateInputProps, {}> {

    render() {
        const {
            showValidation, name, placeholder, popperPlacement, value,
            valid, invalidFeedback, onChange
        } = this.props

        const className = 'form-control ' + getValidationClass(valid, showValidation)

        return <ValidationFeedback valid={valid} showValidation={showValidation} invalidFeedback={invalidFeedback}>
            <DatePicker
                name={name}
                selected={value}
                onChange={onChange}
                className={className}
                dateFormat={dateFormat}
                placeholderText={placeholder}
                popperPlacement={popperPlacement}
                disabledKeyboardNavigation
            />
        </ValidationFeedback>
    }
}

const DateInputWithValidation = withValidation<IDateInputOwnProps, TValue>({ defaultValue: null })(_DateInput)

const formatValidator: Validator<TValue> = (v: TValue) => ({
    valid: !v || !v || v.isValid(),
    invalidFeedback: 'You must enter a valid date (MM/DD/YYYY).'
})

export function DateInput(props: IWithValidationProps<TValue> & IDateInputOwnProps) {
    const validators = [formatValidator].concat(props.validators)
    return <DateInputWithValidation {...props}
               validators={validators} />
}