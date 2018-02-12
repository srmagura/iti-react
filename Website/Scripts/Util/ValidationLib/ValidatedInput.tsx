import * as React from 'react';

import { Validator, getCombinedValidatorOutput } from './ValidatorCore';
import { InputWithFeedback, IValidationFeedbackProps } from './InputWithFeedback';

interface IValidatedInputProps extends React.Props<any> {
    name: string
    type?: string

    value?: string
    defaultValue?: string
    onChange?: (value: string) => void

    showValidation: boolean
    onValidChange?: (valid: boolean) => void

    validators: Validator[]

     // attributes to pass through to the <input>, <select>, or <textarea> element
    inputAttributes?: object

    // allows you to customize how validation feedback gets displayed
    validationFeedbackComponent?(props: IValidationFeedbackProps): JSX.Element
}

interface IValidatedInputState {
    value: string;
}

/* Input that accepts an array of validator functions that take the field's value and synchronously
 * return a boolean indicating valid/invalid. */
export class ValidatedInput extends React.Component<IValidatedInputProps, IValidatedInputState> {

    constructor(props: IValidatedInputProps) {
        super(props)

        let value;
        if (typeof (props.value) !== 'undefined') {
            value = props.value
        } else if (typeof (props.defaultValue) !== 'undefined') {
            value = props.defaultValue
        } else {
            value = ''
        }

        this.state = {
            value: value
        }
    } 

    getCombinedValidatorOutput(value: string) {
        return getCombinedValidatorOutput(value, this.props.validators)
    }

    onChange: (value: string) => void = value => {
        const { onChange, onValidChange } = this.props
        const stateChanges: any = { value }

        if (onChange)
            onChange(value)

        const valid = this.getCombinedValidatorOutput(value).valid

        if (onValidChange)
            onValidChange(valid)

        stateChanges.valid = valid

        this.setState(stateChanges)
    }

    render() {
        const { name, showValidation, type, children, inputAttributes, validationFeedbackComponent } = this.props
        const { value } = this.state

        const validatorOutput = this.getCombinedValidatorOutput(value)

        return <InputWithFeedback value={value} name={name} type={type}
            children={children}
            valid={validatorOutput.valid}
            showValidation={showValidation} onChange={this.onChange}
            invalidFeedback={validatorOutput.invalidFeedback}
            inputAttributes={inputAttributes}
            validationFeedbackComponent={validationFeedbackComponent} />
    }

    componentDidMount() {
        const { onValidChange } = this.props

        if (onValidChange) {
            onValidChange(this.getCombinedValidatorOutput(this.state.value).valid)
        }
    }

    componentWillReceiveProps(nextProps: IValidatedInputProps) {
        if (nextProps.value && nextProps.value !== this.state.value) {
            this.setState({ value: nextProps.value })
        }
    }
}