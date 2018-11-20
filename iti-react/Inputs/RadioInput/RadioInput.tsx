import * as React from 'react'
import {
    WithValidationInjectedProps,
    withValidation,
    Validators,
    ValidationFeedback
} from '../..'

const classSeparator = '__'

export type RadioInputValue = string | number | null

export interface RadioOption {
    value: string | number
    label: string
}

interface RadioButtonProps {
    radioOption: RadioOption
    name: string
    enabled: boolean

    value: RadioInputValue
    onChange(value: string | number): void
}

function RadioButton(props: RadioButtonProps) {
    const { name, value, enabled, radioOption, onChange } = props

    const id = name + '-' + radioOption.value

    const classes = ['form-check', 'form-check-inline', radioOption.value.toString()]

    return (
        <div className={classes.join(' ')} key={radioOption.value}>
            <input
                type="radio"
                className="form-check-input"
                name={name}
                id={id}
                value={radioOption.value}
                checked={radioOption.value === value}
                onChange={() => onChange(radioOption.value)}
                disabled={!enabled}
            />
            <label className="form-check-label" htmlFor={id}>
                {radioOption.label}
            </label>
        </div>
    )
}

interface RadioInputOwnProps {
    options: RadioOption[]
    enabled?: boolean
}

type RadioInputProps = RadioInputOwnProps & WithValidationInjectedProps<RadioInputValue>

class _RadioInput extends React.Component<RadioInputProps> {
    static defaultProps: Partial<RadioInputProps> = {
        enabled: true
    }

    render() {
        const {
            options,
            name,
            onChange,
            value,
            showValidation,
            valid,
            invalidFeedback
        } = this.props
        const enabled = this.props.enabled as boolean // defaulted

        const containerClass = 'radio-button-container'
        const containerClasses = [containerClass, name + classSeparator + containerClass]

        return (
            <ValidationFeedback
                showValidation={showValidation}
                valid={valid}
                invalidFeedback={invalidFeedback}
            >
                <div className={containerClasses.join(' ')}>
                    {options.map(o => (
                        <RadioButton
                            radioOption={o}
                            name={name}
                            value={value}
                            onChange={onChange}
                            enabled={enabled}
                            key={o.value}
                        />
                    ))}
                </div>
            </ValidationFeedback>
        )
    }
}

const options = { defaultValue: null }

export const RadioInput = withValidation<RadioInputOwnProps, RadioInputValue>(options)(
    _RadioInput
)

function required() {
    return (value: RadioInputValue | null) => ({
        valid: value !== null,
        invalidFeedback: Validators.required()('').invalidFeedback
    })
}

export const RadioValidators = {
    required
}
