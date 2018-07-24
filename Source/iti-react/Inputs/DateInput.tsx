﻿import * as React from 'react'
import * as moment from 'moment'
import DatePicker from 'react-datepicker'
import {
    getValidationClass,
    ValidationFeedback,
    Validator,
    IWithValidationInjectedProps,
    withValidation,
    IWithValidationProps
} from '../Validation'
import { timeFormat } from './TimeInput'

export const dateInputFormat = 'M/D/YYYY'

export type DateInputValue = {
    moment?: moment.Moment
    raw: string
    includesTime: boolean
}

export const defaultDateInputValue: DateInputValue = {
    moment: undefined,
    raw: '',
    includesTime: false
}

export function dateInputValueFromMoment(m: moment.Moment): DateInputValue {
    return {
        moment: m,
        raw: m.format(dateInputFormat),
        includesTime: false
    }
}

interface IDateInputOwnProps extends React.Props<any> {
    placeholder?: string
    popperPlacement?: string
    showTimeSelect?: boolean
    timeIntervals?: number
}

type IDateInputProps = IDateInputOwnProps & IWithValidationInjectedProps<DateInputValue>

class _DateInput extends React.Component<IDateInputProps, {}> {
    componentDidMount() {
        const { showTimeSelect, onChange, value } = this.props

        onChange({ ...value, includesTime: showTimeSelect === true })
    }

    getFormat = () => {
        const { showTimeSelect } = this.props

        let format = dateInputFormat
        if (showTimeSelect) {
            format += ' ' + timeFormat
        }

        return format
    }

    onChange = (myMoment: moment.Moment | null) => {
        const { onChange, value } = this.props

        onChange({
            ...value,
            moment: myMoment ? myMoment : undefined,
            raw: myMoment ? myMoment.format(dateInputFormat) : ''
        })
    }

    onChangeRaw = (e: React.SyntheticEvent<any>) => {
        const { value, onChange } = this.props

        const raw = e.currentTarget.value
        const myMoment = moment(raw, this.getFormat(), true) // strict=true

        onChange({
            ...value,
            moment: myMoment.isValid() ? myMoment : undefined,
            raw
        })
    }

    render() {
        const {
            showValidation,
            name,
            placeholder,
            popperPlacement,
            value,
            valid,
            invalidFeedback,
            onChange,
            showTimeSelect,
            timeIntervals
        } = this.props

        const className = 'form-control ' + getValidationClass(valid, showValidation)

        // TODO use theme colors?

        return (
            <ValidationFeedback
                valid={valid}
                showValidation={showValidation}
                invalidFeedback={invalidFeedback}
            >
                <DatePicker
                    name={name}
                    selected={value.moment ? value.moment : null}
                    onChange={this.onChange}
                    onChangeRaw={this.onChangeRaw}
                    className={className}
                    dateFormat={this.getFormat()}
                    placeholderText={placeholder}
                    popperPlacement={popperPlacement}
                    disabledKeyboardNavigation
                    showTimeSelect={showTimeSelect}
                    timeIntervals={timeIntervals}
                    timeFormat={timeFormat}
                />
            </ValidationFeedback>
        )
    }
}

const DateInputWithValidation = withValidation<IDateInputOwnProps, DateInputValue>({
    defaultValue: defaultDateInputValue
})(_DateInput)

/***** Validators *****/

// Having the same invalid feedback for formatValidator and requiredValidator is a little weird,
// but I can't think of anything better.
function getInvalidFeedback(includesTime: boolean) {
    let invalidFeedback = 'You must enter a valid date (MM/DD/YYYY).'
    if (includesTime) {
        invalidFeedback = 'You must enter a valid date and time.'
    }

    return invalidFeedback
}

const formatValidator: Validator<DateInputValue> = (v: DateInputValue) => {
    let valid = false

    if (v.moment && v.moment.isValid()) {
        valid = true
    } else if (v.raw.length === 0) {
        valid = true
    }

    return {
        valid,
        invalidFeedback: getInvalidFeedback(v.includesTime)
    }
}

export function DateInput(
    props: IWithValidationProps<DateInputValue> & IDateInputOwnProps
) {
    const validators = [formatValidator].concat(props.validators)
    return <DateInputWithValidation {...props} validators={validators} />
}

function required(): Validator<DateInputValue> {
    return (v: DateInputValue) => ({
        valid: !!v.moment && v.moment.isValid(),
        invalidFeedback: getInvalidFeedback(v.includesTime)
    })
}

export const DateValidators = {
    required
}