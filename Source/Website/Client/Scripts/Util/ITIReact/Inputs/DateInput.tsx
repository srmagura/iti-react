import * as React from 'react';
import * as moment from 'moment';
import DatePicker from 'react-datepicker';

import {
    getValidationClass, ValidationFeedback, Validator, IWithValidationInjectedProps,
    withValidation, IWithValidationProps
} from '../Validation';

export const dateFormat = 'M/D/YYYY'

export type DateInputValue = {
    moment?: moment.Moment
    raw: string
}

export const defaultDateInputValue = {
    moment: undefined,
    raw: ''
}

interface IDateInputOwnProps extends React.Props<any> {
    name: string
    placeholder?: string
    popperPlacement?: string
}

type IDateInputProps = IDateInputOwnProps & IWithValidationInjectedProps<DateInputValue>

class _DateInput extends React.Component<IDateInputProps, {}> {

    onChange = (myMoment: moment.Moment | null) => {
        const { onChange } = this.props

        onChange({
            moment: myMoment ? myMoment : undefined,
            raw: myMoment ? myMoment.format(dateFormat) : ''
        })
    }

    onChangeRaw = (e: React.SyntheticEvent<any>) => {
        const { value, onChange } = this.props

        const raw = e.currentTarget.value
        const myMoment = moment(raw, dateFormat, true) // strict=true

        onChange({
            moment: myMoment.isValid() ? myMoment : undefined,
            raw
        })
    }

    render() {
        const {
            showValidation, name, placeholder, popperPlacement, value,
            valid, invalidFeedback, onChange
        } = this.props

        const className = 'form-control ' + getValidationClass(valid, showValidation)

        return <ValidationFeedback valid={valid} showValidation={showValidation} invalidFeedback={invalidFeedback}>
            <DatePicker
                name={name}
                selected={value.moment ? value.moment : null}
                onChange={this.onChange}
                onChangeRaw={this.onChangeRaw}
                className={className}
                dateFormat={dateFormat}
                placeholderText={placeholder}
                popperPlacement={popperPlacement}
                disabledKeyboardNavigation />
        </ValidationFeedback>
    }
}

const DateInputWithValidation = withValidation<IDateInputOwnProps, DateInputValue>({ defaultValue: defaultDateInputValue })(_DateInput)

const formatValidator: Validator<DateInputValue> = (v: DateInputValue) => {
    let valid = false

    if (v.moment && v.moment.isValid()) {
        valid = true
    } else if (v.raw.length === 0) {
        valid = true
    }

    return {
        valid,
        // this invalidFeedback makes it sound like the field is required *shrug*
        invalidFeedback: 'You must enter a valid date (MM/DD/YYYY).'
    }
}

export function DateInput(props: IWithValidationProps<DateInputValue> & IDateInputOwnProps) {
    const validators = [formatValidator].concat(props.validators)
    return <DateInputWithValidation {...props}
        validators={validators} />
}

export function requiredDateValidator(): Validator<DateInputValue> {
    return (v: DateInputValue) => ({
        valid: !!v.moment && v.moment.isValid(),
        invalidFeedback: 'You must enter a valid date (MM/DD/YYYY).'
    })
}