import React from 'react'
import moment from 'moment-timezone'
import {
    ValidationFeedback,
    WithValidationInjectedProps,
    withValidation,
    WithValidationProps
} from '../Validation'
import { SelectValue, ValidatedSelect } from '.'
import {
    toHoursAndMinutes,
    toDecimalHours,
    undefinedToNull,
    Validators,
    Validator
} from '@interface-technologies/iti-react-core'
import { isEqual } from 'lodash'
import { LinkButton } from '@interface-technologies/iti-react'

//
// TimeInputValue
//

// Don't do TimeInputValue = Moment because representing time of day with a Moment / DateTime
// leads to DST bugs.
export type TimeInputValue = {
    hours?: number // 1, 2, ..., 12
    minutes?: number
    ampm?: 'am' | 'pm'
}

export const defaultTimeInputValue: TimeInputValue = {}

export function timeInputValueFromDecimalHours(decimalHours?: number): TimeInputValue {
    if (typeof decimalHours === 'undefined') return defaultTimeInputValue

    const { hours, minutes } = toHoursAndMinutes(decimalHours)
    const mo = moment()
        .hours(hours)
        .minutes(minutes)

    return {
        hours: parseInt(mo.format('h')), // 1, 2, ..., 12
        minutes: mo.minutes(),
        ampm: mo.format('a') as 'am' | 'pm'
    }
}

export function timeInputValueToDecimalHours(value: TimeInputValue): number | undefined {
    if (
        typeof value.hours === 'undefined' ||
        typeof value.minutes === 'undefined' ||
        typeof value.ampm === 'undefined'
    ) {
        return undefined
    }

    let hours = value.hours % 12
    if (value.ampm === 'pm') hours += 12

    return toDecimalHours(hours, value.minutes)
}

//
// TimeInput component
//

const toOption = (x: number | string) => ({ value: x, label: x.toString() })

const options = {
    hours: [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(toOption),
    minutes: ['00', '15', '30', '45'].map(m => ({ value: parseInt(m), label: m })),
    ampm: ['am', 'pm'].map(toOption)
}

export interface ClearButtonComponentProps {
    onClick(): void
    enabled: boolean
}

function defaultClearButtonComponent({ onClick, enabled }: ClearButtonComponentProps) {
    if (!enabled) {
        return <span className="default-clear-button disabled">Clear</span>
    }

    return (
        <LinkButton onClick={onClick} className="default-clear-button">
            Clear
        </LinkButton>
    )
}

interface TimeInputOwnProps {
    individualInputsRequired: boolean

    isClearable?: boolean
    clearButtonComponent?: React.StatelessComponent<ClearButtonComponentProps>

    enabled?: boolean
}

type TimeInputProps = TimeInputOwnProps & WithValidationInjectedProps<TimeInputValue>

class _TimeInput extends React.Component<TimeInputProps> {
    static defaultProps: Pick<
        TimeInputProps,
        'isClearable' | 'clearButtonComponent' | 'enabled'
    > = {
        isClearable: true,
        clearButtonComponent: defaultClearButtonComponent,
        enabled: true
    }

    fromSelectValue = (selectValue: SelectValue) => {
        if (selectValue === '' || selectValue === null) {
            return undefined
        }

        return selectValue
    }

    parseOptionalInt = (intString: string | undefined) => {
        if (typeof intString === 'undefined') return undefined

        return parseInt(intString)
    }

    onHoursChange: (selectValue: SelectValue) => void = selectValue => {
        const { onChange, value } = this.props

        onChange({
            ...value,
            hours: this.fromSelectValue(selectValue) as number
        })
    }

    onMinutesChange: (selectValue: SelectValue) => void = selectValue => {
        const { onChange, value } = this.props

        onChange({
            ...value,
            minutes: this.fromSelectValue(selectValue) as number
        })
    }

    onAmpmChange: (selectValue: SelectValue) => void = selectValue => {
        const { onChange, value } = this.props

        onChange({
            ...value,
            ampm: this.fromSelectValue(selectValue) as 'am' | 'pm' | undefined
        })
    }

    onClearClick = () => {
        this.props.onChange(defaultTimeInputValue)
    }

    render() {
        const {
            name,
            showValidation,
            value,
            valid,
            invalidFeedback,
            individualInputsRequired,
            isClearable
        } = this.props
        const { hours, minutes, ampm } = value
        const ClearButton = this.props.clearButtonComponent! // remove assertions TS 3.0
        const enabled = this.props.enabled!

        const validators: Validator<SelectValue>[] = []

        if (individualInputsRequired) {
            // don't display any feedback under individual fields
            validators.push(value => ({
                valid: value !== null,
                invalidFeedback: undefined
            }))
        }

        const commonProps = {
            showValidation,
            validators,
            enabled
        }

        return (
            <div className="time-input">
                <ValidationFeedback
                    valid={valid}
                    showValidation={showValidation}
                    invalidFeedback={invalidFeedback}
                >
                    <input type="hidden" name={name} value={JSON.stringify(value)} />
                    <div className="flex-container">
                        <div className="input">
                            <ValidatedSelect
                                {...commonProps}
                                name={name + '_hours'}
                                value={undefinedToNull(hours)}
                                onChange={this.onHoursChange}
                                options={options.hours}
                                placeholder="HH"
                                aria-label="Hours"
                            />
                        </div>
                        <div className="input">
                            <ValidatedSelect
                                {...commonProps}
                                name={name + '_minutes'}
                                value={undefinedToNull(minutes)}
                                onChange={this.onMinutesChange}
                                options={options.minutes}
                                placeholder="mm"
                                aria-label="Minutes"
                            />
                        </div>
                        <div className="input">
                            <ValidatedSelect
                                {...commonProps}
                                name={name + '_ampm'}
                                value={undefinedToNull(ampm)}
                                onChange={this.onAmpmChange}
                                options={options.ampm}
                                placeholder=""
                                aria-label="AM or PM"
                            />
                        </div>
                        {isClearable && !isEqual(value, defaultTimeInputValue) && (
                            <ClearButton
                                onClick={enabled ? this.onClearClick : () => {}}
                                enabled={enabled}
                            />
                        )}
                    </div>
                </ValidationFeedback>
            </div>
        )
    }
}

const TimeInputWithValidation = withValidation<TimeInputOwnProps, TimeInputValue>({
    defaultValue: {}
})(_TimeInput)

const validator: Validator<TimeInputValue> = (value: TimeInputValue) => {
    const { hours, minutes, ampm } = value
    const types = [typeof hours, typeof minutes, typeof ampm]

    let undefinedCount = 0
    for (const type of types) {
        if (type === 'undefined') undefinedCount++
    }

    return {
        valid: undefinedCount === 0 || undefinedCount === 3,
        invalidFeedback: 'You must enter a valid time or leave all fields blank.'
    }
}

export function TimeInput(
    props: WithValidationProps<TimeInputValue> & TimeInputOwnProps
) {
    const validators = [validator].concat(props.validators)

    return <TimeInputWithValidation {...props} validators={validators} />
}

function required(): Validator<TimeInputValue> {
    return (value: TimeInputValue) => {
        const { hours, minutes, ampm } = value

        return {
            valid:
                typeof hours !== 'undefined' &&
                typeof minutes !== 'undefined' &&
                typeof ampm !== 'undefined',
            invalidFeedback: Validators.required()('').invalidFeedback
        }
    }
}

export const TimeValidators = {
    required
}
