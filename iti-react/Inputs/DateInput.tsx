import * as React from 'react'
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
import { getRandomId } from '..'

// MomentJS format strings
export const dateInputFormat = 'M/D/YYYY'
const timeFormat = 'h:mm a'
export const dateTimeInputFormat = dateInputFormat + ' ' + timeFormat

// Equivalent date-fns format strings (used by react-datepicker)
export const fnsDateInputFormat = 'M/d/yyyy'
const fnsTimeFormat = 'h:mm a'
export const fnsDateTimeInputFormat = fnsDateInputFormat + ' ' + fnsTimeFormat

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

interface DateInputOwnProps {
    id?: string
    placeholder?: string
    popperPlacement?: string
    showTimeSelect?: boolean
    timeIntervals?: number
    enabled?: boolean
    showPicker?: boolean
}

type DateInputProps = DateInputOwnProps & WithValidationInjectedProps<DateInputValue>

class _DateInput extends React.Component<DateInputProps, {}> {
    static defaultProps: Pick<DateInputOwnProps, 'enabled' | 'showPicker'> = {
        enabled: true,
        showPicker: true
    }

    // Use this instead of this.props.id!
    id: string

    constructor(props: DateInputProps) {
        super(props)

        // DateInput needs an ID to function, so create an ID if one has not been provided.
        this.id = this.props.id ? this.props.id : getRandomId()
    }

    componentDidUpdate() {
        // If, for some reason, the ID prop changes after the constructor is called
        if (this.props.id && this.props.id !== this.id) {
            this.id = this.props.id
        }
    }

    get fnsFormat() {
        return this.props.showTimeSelect ? fnsDateTimeInputFormat : fnsDateInputFormat
    }

    get momentFormat() {
        return this.props.showTimeSelect ? dateTimeInputFormat : dateInputFormat
    }

    onChange = (date: Date | null) => {
        const myMoment = date ? moment(date) : null

        this.props.onChange({
            moment: myMoment ? myMoment : undefined,
            raw: $('#' + this.id).val() as string
        })
    }

    // When the user clicks away, set raw to the formatted moment. This "corrects" the
    // raw string when the user has typed a partial date.
    //
    // For example, user types '12/1' and
    //
    //     this.props.value = { moment: moment('12/1/2001'), raw: '12/1' }
    //
    // which is considered invalid because moment and raw are different. This onBlur function
    // will set raw to '12/1/2001', making the input valid. We only do this on blur because otherwise
    // the input will rapidly change between valid and invalid as the user types.
    onBlur = () => {
        const myMoment = this.props.value.moment

        this.props.onChange({
            moment: myMoment,
            raw: myMoment ? myMoment.format(this.momentFormat) : ''
        })
    }

    onChangeRaw = (e: React.SyntheticEvent<any>) => {
        let raw = e.currentTarget.value

        // Don't use strict parsing, because it will reject parse partial datetimes
        const myMoment = moment(raw.trim(), this.momentFormat)

        this.props.onChange({
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
            enabled,
            showTimeSelect,
            timeIntervals,
            showPicker
        } = this.props

        const className = 'form-control ' + getValidationClass(valid, showValidation)

        return (
            <ValidationFeedback
                valid={valid}
                showValidation={showValidation}
                invalidFeedback={invalidFeedback}
            >
                {showPicker && (
                    <DatePicker
                        id={this.id}
                        name={name}
                        // TODO: remove as any when @types/react-datepicker 2.0.0 is available
                        selected={value.moment ? (value.moment.toDate() as any) : null}
                        onChange={this.onChange as any}
                        onChangeRaw={this.onChangeRaw}
                        onBlur={this.onBlur}
                        className={className}
                        dateFormat={this.fnsFormat}
                        placeholderText={placeholder}
                        popperPlacement={popperPlacement}
                        disabledKeyboardNavigation
                        showTimeSelect={showTimeSelect}
                        timeIntervals={timeIntervals}
                        timeFormat={timeFormat}
                        disabled={!enabled}
                    />
                )}
                {!showPicker && (
                    <div className="date-input-no-picker-wrapper">
                        <input
                            id={this.id}
                            name={name}
                            value={value ? value.raw : ''}
                            onChange={this.onChangeRaw}
                            className={className}
                            placeholder={placeholder}
                            disabled={!enabled}
                        />
                    </div>
                )}
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
            const format = includesTime ? dateTimeInputFormat : dateInputFormat

            // This check prevents the input from frequently changing between valid and invalid as the user types
            // (that would be annoying because the color changes and the validation feedback appears and disappears)
            if (moment(v.raw.trim(), format, true).isValid()) {
                valid = true
            }
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
