import * as React from 'react';
import * as moment from 'moment';

import { ValidatedInput, Validators, ValidationFeedback } from '../Validation';
const SELECT_VALUE_BLANK = ''

export const timeFormat = 'h:mm a'

const options = {
    hours: [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    minutes: ['00', '15', '30', '45'],
    ampm: ['am', 'pm'],
}

interface ITimeInputProps extends React.Props<any> {
    name: string
    showValidation: boolean
    onValidChange(valid: boolean): void

    // value, onChange, and defaultValue are work with formatted time strings. See the 
    // timeFormat constant for the format string. We're using strings here instead of
    // Moment objects, because this component does not know the timezone / UTC offset of the times.
    value?: string
    onChange?(value: string | undefined): void
    defaultValue?: string

    showBlank?: boolean
    required?: boolean
}

interface ITimeInputState {
    hours?: number
    minutes?: number
    ampm?: string
}

export class TimeInput extends React.Component<ITimeInputProps, ITimeInputState> {

    static defaultProps: Partial<ITimeInputProps> = {
        showBlank: true,
        required: true
    }

    constructor(props: ITimeInputProps) {
        super(props)

        let value

        if (props.value) {
            value = props.value
        } else if (props.defaultValue) {
            value = props.defaultValue
        } else {
            value = undefined
        }

        this.state = {
            ...this.getStateFromString(value)
        }
    }

    componentDidMount() {
        this.forceValidate()
    }

    componentWillReceiveProps(nextProps: ITimeInputProps) {
        const value = this.getStringFromState(this.state)

        if (nextProps.value && value !== nextProps.value) {
            this.setState(s => ({
                ...s,
                ...this.getStateFromString(nextProps.value)
            }),
                this.forceValidate)
        }
    }

    forceValidate = () => {
        const { onValidChange } = this.props

        if (onValidChange)
            onValidChange(this.getValidatorOutput().valid)
    }

    getStateFromString = (value: string | undefined) => {
        const time = moment(value, timeFormat)

        if (time.isValid()) {
            return {
                hours: parseInt(time.format('h')), // 1, 2, ..., 12
                minutes: time.minutes(),
                ampm: time.format('a')
            }
        } else {
            return {
                hours: undefined,
                minutes: undefined,
                ampm: undefined
            }
        }
    }

    getStringFromState = (state: {
        hours?: number
        minutes?: number
        ampm?: string
    }) => {
        const { hours, minutes, ampm } = state

        if (typeof hours !== 'undefined' &&
            typeof minutes !== 'undefined' &&
            typeof ampm !== 'undefined') {

            // Make sure that the string with give to onChange is in timeFormat
            const time = moment(`${hours}:${minutes} ${ampm}`, 'h:m a')
            const formatted = time.format(timeFormat)
            return formatted
        }

        return undefined
    }

    getValidatorOutput = () => {
        const { required } = this.props
        const formatted = this.getStringFromState(this.state)

        let valid = true
        let invalidFeedback

        if (required) {
            valid = typeof formatted !== 'undefined'
            invalidFeedback = Validators.required()('').invalidFeedback
        } else {
            const { hours, minutes, ampm } = this.state
            const types = [typeof hours, typeof minutes, typeof ampm]

            let undefinedCount = 0
            for (const type of types) {
                if (type === 'undefined')
                    undefinedCount++
            }

            valid = undefinedCount === 0 || undefinedCount === 3
            invalidFeedback = 'You must enter a valid time or leave all fields blank.'
        }

        return { valid, invalidFeedback }
    }

    callOnChange = () => {
        const { onChange, onValidChange, required } = this.props

        const formatted = this.getStringFromState(this.state)

        if (onChange)
            onChange(formatted)

        if (onValidChange) {
            onValidChange(this.getValidatorOutput().valid)
        }

    }

    fromSelectValue = (selectValue: string) => {
        if (selectValue === SELECT_VALUE_BLANK) {
            return undefined
        } else {
            return selectValue
        }
    }

    toSelectValue = (value: string | number | undefined) => {
        if (typeof value === 'undefined') {
            return SELECT_VALUE_BLANK
        } else {
            return value.toString()
        }
    }

    parseOptionalInt = (intString: string | undefined) => {
        if (typeof intString === 'undefined')
            return undefined

        return parseInt(intString)
    }

    onHoursChange: (selectValue: string) => void = selectValue => {
        const value = this.fromSelectValue(selectValue)
        const hours = this.parseOptionalInt(value)

        this.setState(s => ({ ...s, hours }), this.callOnChange)
    }

    onMinutesChange: (selectValue: string) => void = selectValue => {
        const value = this.fromSelectValue(selectValue)
        const minutes = this.parseOptionalInt(value)

        this.setState(s => ({ ...s, minutes }), this.callOnChange)
    }

    onAmpmChange: (selectValue: string) => void = selectValue => {
        const value = this.fromSelectValue(selectValue)
        this.setState(s => ({ ...s, ampm: value }), this.callOnChange)
    }

    render() {
        const { name, showValidation, onValidChange, required, showBlank } = this.props
        const { hours, minutes, ampm } = this.state
        const formattedTime = this.getStringFromState(this.state)

        const validators = []

        if (required) {
            // don't display any feedback under individual fields
            validators.push((value: string) => ({
                valid: value !== SELECT_VALUE_BLANK,
                invalidFeedback: undefined
            }))
        }

        const { valid, invalidFeedback } = this.getValidatorOutput()

        return <div className="time-input">
            <ValidationFeedback
                valid={valid}
                showValidation={showValidation}
                invalidFeedback={invalidFeedback}>
                <div className="inputs">
                    <input type="hidden"
                        name={name}
                        value={typeof formattedTime !== 'undefined' ? formattedTime : ''} />
                    <ValidatedInput name={name + '_hours'}
                        type="select"
                        showValidation={showValidation}
                        validators={validators}
                        value={this.toSelectValue(hours)}
                        onChange={this.onHoursChange}>
                        {showBlank && <option value={SELECT_VALUE_BLANK}>HH</option>}
                        {options.hours.map(h =>
                            <option value={h} key={h}>
                                {h}
                            </option>)}
                    </ValidatedInput>
                    <ValidatedInput name={name + '_minutes'}
                        type="select"
                        showValidation={showValidation}
                        validators={validators}
                        value={this.toSelectValue(minutes)}
                        onChange={this.onMinutesChange}>
                        {showBlank && <option value={SELECT_VALUE_BLANK}>mm</option>}
                        {options.minutes.map(m => {
                            // Need this parseInt because of leading zeros in minutes
                            return <option value={parseInt(m)} key={m}>
                                {m}
                            </option>
                        })}
                    </ValidatedInput>
                    <ValidatedInput name={name + '_ampm'}
                        type="select"
                        showValidation={showValidation}
                        validators={validators}
                        value={this.toSelectValue(ampm)}
                        onChange={this.onAmpmChange}>
                        {showBlank && <option value={SELECT_VALUE_BLANK}></option>}
                        {options.ampm.map(s =>
                            <option value={s} key={s}>
                                {s}
                            </option>)}
                    </ValidatedInput>
                </div>
            </ValidationFeedback>
        </div>
    }
}
