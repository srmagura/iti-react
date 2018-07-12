import * as React from 'react'
import {
    IWithValidationInjectedProps,
    withValidation,
    Validators,
    ValidationFeedback
} from '@interface-technologies/iti-react'

interface IBooleanRadioInputOwnProps {
    disabled?: boolean
}

type IBooleanRadioInputProps = IBooleanRadioInputOwnProps &
    IWithValidationInjectedProps<boolean | null>

class _BooleanRadioInput extends React.Component<IBooleanRadioInputProps> {
    render() {
        const {
            name,
            onChange,
            value,
            disabled,
            showValidation,
            valid,
            invalidFeedback
        } = this.props

        const trueId = name + '-true'
        const falseId = name + '-false'

        return (
            <ValidationFeedback
                showValidation={showValidation}
                valid={valid}
                invalidFeedback={invalidFeedback}
            >
                <div className="form-check form-check-inline" key="true">
                    <input
                        type="radio"
                        name={name}
                        value="true"
                        id={trueId}
                        checked={value === true}
                        onChange={() => onChange(true)}
                        disabled={disabled}
                    />&nbsp;
                    <label htmlFor={trueId}>Yes</label>
                </div>
                <div className="form-check form-check-inline" key="false">
                    <input
                        type="radio"
                        name={name}
                        value="false"
                        id={falseId}
                        checked={value === false}
                        onChange={() => onChange(false)}
                        disabled={disabled}
                    />&nbsp;
                    <label htmlFor={falseId}>No</label>
                </div>
            </ValidationFeedback>
        )
    }
}

const options = { defaultValue: null }

export const BooleanRadioInput = withValidation<
    IBooleanRadioInputOwnProps,
    boolean | null
>(options)(_BooleanRadioInput)

function required() {
    return (value: boolean | null) => ({
        valid: value !== null,
        invalidFeedback: Validators.required()('').invalidFeedback
    })
}

export const BooleanValidators = {
    required
}
