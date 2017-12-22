import * as React from 'react';

import { InputWithFeedback } from './InputWithFeedback';

interface IValidatorOutput {
    valid: boolean
    invalidFeedback?: string
}

interface IValidatedInputProps extends React.Props<any> {
    name: string
    type?: string

    value?: string
    defaultValue?: string
    onChange?: (value: string) => void

    showValidation: boolean
    onValidChange?: (valid: boolean) => void

    validators: ((value: string) => IValidatorOutput)[]
}

interface IValidatedInputState {
    value: string;
}

/* Input that accepts an array of validator functions that take the field's value and synchronously
 * return a boolean indicating valid/invalid. */
export class ValidatedInput extends React.Component<IValidatedInputProps, IValidatedInputState> {

    constructor(props: IValidatedInputProps) {
        super(props)

        if (typeof(props.value) === 'undefined' && typeof(props.defaultValue) === 'undefined')
            throw new Error("Must specify value or defaultValue")

        this.state = {
            value: (typeof(props.value) !== 'undefined' ? props.value : props.defaultValue) as string
        }
    }

    getCombinedValidatorOutput(value: string) {
        for (const validator of this.props.validators) {
            const currentOutput = validator(value)

            if (!currentOutput.valid) {
               return currentOutput
            }
        }

        return {
            valid: true,
            invalidFeedback: undefined
        }
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
        const { name, showValidation, type, children } = this.props
        const { value } = this.state

        const validatorOutput = this.getCombinedValidatorOutput(value)

        return <InputWithFeedback value={value} name={name} type={type}
            children={children}
            valid={validatorOutput.valid}
            showValidation={showValidation} onChange={this.onChange}
            invalidFeedback={validatorOutput.invalidFeedback} />
    }

    componentDidMount() {
        const { onValidChange } = this.props

        if (onValidChange) {
            onValidChange(this.getCombinedValidatorOutput(this.state.value).valid)
        }
    }
}