import * as React from 'react'
import {
    IWithValidationInjectedProps,
    withValidation,
    Validators,
    ValidationFeedback
} from '../..'

export type RadioInputValue = string | number | null

export interface IRadioOption {
    value: string | number
    label: string
}

interface IRadioButtonProps extends React.Props<any> {
    radioOption: IRadioOption
    name: string
    enabled: boolean

    value: RadioInputValue
    onChange(value: string | number): void
}

function RadioButton(props: IRadioButtonProps) {
    const { name, value, enabled, radioOption, onChange } = props

    const id = name + '_' + radioOption.value

    const classes = ['form-check', 'form-check-inline', radioOption.value.toString()]

    return (
        <div className={classes.join(' ')} key={radioOption.value}>
            <input
                type="radio"
                name={name}
                id={id}
                value={radioOption.value}
                checked={radioOption.value === value}
                onChange={() => onChange(radioOption.value)}
                disabled={!enabled}
            />&nbsp;
            <label htmlFor={id}>{radioOption.label}</label>
        </div>
    )
}

interface IRadioInputOwnProps {
    options: IRadioOption[]
    enabled?: boolean
}

type IRadioInputProps = IRadioInputOwnProps &
    IWithValidationInjectedProps<RadioInputValue>

class _RadioInput extends React.Component<IRadioInputProps> {
    static defaultProps: Partial<IRadioInputProps> = {
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

        return (
            <ValidationFeedback
                showValidation={showValidation}
                valid={valid}
                invalidFeedback={invalidFeedback}
            >
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
            </ValidationFeedback>
        )
    }
}

const options = { defaultValue: null }

export const RadioInput = withValidation<IRadioInputOwnProps, RadioInputValue>(options)(
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
