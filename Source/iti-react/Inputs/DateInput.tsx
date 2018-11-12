﻿import * as React from 'react'
import * as moment from 'moment'
import DatePicker from 'react-datepicker'
import {
    getValidationClass,
    ValidationFeedback,
    Validator,
    WithValidationInjectedProps,
    withValidation,
    WithValidationProps
} from '../Validation'

export const dateInputFormat = 'M/D/YYYY'
const timeFormat = 'h:mm a'
export const dateTimeInputFormat = dateInputFormat + ' ' + timeFormat

export type DateInputValue = {
    moment?: moment.Moment
    raw: string
}

export const defaultDateInputValue: DateInputValue = {
    moment: undefined,
    raw: ''
}

export function dateInputValueFromMoment(m: moment.Moment): DateInputValue {
    return {
        moment: m,
        raw: m.format(dateInputFormat)
    }
}

interface DateInputOwnProps extends React.Props<any> {
    id?: string
    placeholder?: string
    popperPlacement?: string
    showTimeSelect?: boolean
    timeIntervals?: number
    enabled?: boolean
}

type DateInputProps = DateInputOwnProps & WithValidationInjectedProps<DateInputValue>

class _DateInput extends React.Component<DateInputProps, {}> {
    static defaultProps: Pick<DateInputOwnProps, 'enabled'> = {
        enabled: true
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

        let raw = e.currentTarget.value
        if (raw) raw = raw.trim() // moment strict parsing will reject extraneous whitespace

        const myMoment = moment(raw, this.getFormat(), true) // strict=true

        onChange({
            ...value,
            moment: myMoment.isValid() ? myMoment : undefined,
            raw
        })
    }

    render() {
        const {
            id,
            showValidation,
            name,
            placeholder,
            popperPlacement,
            value,
            valid,
            invalidFeedback,
            enabled,
            showTimeSelect,
            timeIntervals
        } = this.props

        const className = 'form-control ' + getValidationClass(valid, showValidation)

        return (
            <ValidationFeedback
                valid={valid}
                showValidation={showValidation}
                invalidFeedback={invalidFeedback}
            >
                <DatePicker
                    id={id}
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
                    disabled={!enabled}
                />
            </ValidationFeedback>
        )
    }
}

const DateInputWithValidation = withValidation<DateInputOwnProps, DateInputValue>({
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

function formatValidator(includesTime: boolean = false): Validator<DateInputValue> {
    return (v: DateInputValue) => {
        let valid = false

        if (v.moment && v.moment.isValid()) {
            valid = true
        } else if (v.raw.length === 0) {
            valid = true
        }

        return {
            valid,
            invalidFeedback: getInvalidFeedback(includesTime)
        }
    }
}

export function DateInput(
    props: WithValidationProps<DateInputValue> & DateInputOwnProps
) {
    const validators = [formatValidator(props.showTimeSelect)].concat(props.validators)
    return <DateInputWithValidation {...props} validators={validators} />
}

function required(includesTime: boolean = false): Validator<DateInputValue> {
    return (v: DateInputValue) => ({
        valid: !!v.moment && v.moment.isValid(),
        invalidFeedback: getInvalidFeedback(includesTime)
    })
}

export const DateValidators = {
    required
}
