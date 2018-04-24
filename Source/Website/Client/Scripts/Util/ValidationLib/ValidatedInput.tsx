import * as React from 'react';

import { Validator, getCombinedValidatorOutput, IValidatorOutput } from './ValidatorCore';
import { AsyncValidator, AsyncValidatorRunner } from './AsyncValidator';
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
    asyncValidator?: AsyncValidator

    // attributes to pass through to the <input>, <select>, or <textarea> element
    inputAttributes?: object

    // allows you to customize how validation feedback gets displayed
    validationFeedbackComponent?(props: IValidationFeedbackProps): JSX.Element
}

interface IValidatedInputState {
    value: string
    asyncValidationInProgress: boolean
    asyncValidatorOutput?: IValidatorOutput
}

/* Input that accepts an array of validator functions that take the field's value and synchronously
 * return a boolean indicating valid/invalid. */
export class ValidatedInput extends React.Component<IValidatedInputProps, IValidatedInputState> {

    asyncValidatorRunner?: AsyncValidatorRunner

    constructor(props: IValidatedInputProps) {
        super(props)

        let value
        if (typeof (props.value) !== 'undefined') {
            value = props.value
        } else if (typeof (props.defaultValue) !== 'undefined') {
            value = props.defaultValue
        } else {
            value = ''
        }

        this.state = {
            value: value,
            asyncValidationInProgress: false,
            asyncValidatorOutput: undefined
        }
    }

    onAsyncResultReceived = (output: IValidatorOutput) => {
        const { onValidChange } = this.props
        const { value } = this.state

        if (onValidChange) {
            const syncValid = this.getCombinedValidatorOutput(value).valid
            onValidChange(output.valid && syncValid)
        }

        this.setState(s => ({
            ...s,
            asyncValidatorOutput: output
        }))
    }

    componentDidMount() {
        const { asyncValidator } = this.props

        if (asyncValidator) {
            this.asyncValidatorRunner = new AsyncValidatorRunner({
                validator: asyncValidator,
                onResultReceived: this.onAsyncResultReceived,
                onInProgressChange: inProgress =>
                    this.setState(s => ({
                        ...s,
                        asyncValidationInProgress: inProgress
                    }))
            })
        }

        this.forceValidate(this.state.value)
    }

    getCombinedValidatorOutput(value: string) {
        return getCombinedValidatorOutput(value, this.props.validators)
    }

    onChange: (newValue: string) => void = newValue => {
        const { onChange, onValidChange, value } = this.props
        const stateChanges: any = { value: newValue }

        let valid = this.getCombinedValidatorOutput(newValue).valid
        if (valid && this.asyncValidatorRunner) {
            this.asyncValidatorRunner.handleInputChange(newValue)
            valid = false
        }

        if (onValidChange)
            onValidChange(valid)

        stateChanges.valid = valid

        if (typeof (value) !== 'undefined') {
            if (onChange)
                onChange(newValue)
        } else {
            this.setState(stateChanges)
        }
    }

    componentWillReceiveProps(nextProps: IValidatedInputProps) {
        if (typeof (nextProps.value) !== 'undefined' && nextProps.value !== this.state.value) {
            this.forceValidate(nextProps.value)
            this.setState({
                value: nextProps.value,
            })
        }
    }

    forceValidate(value: string) {
        const { onValidChange } = this.props

        if (onValidChange) {
            let valid = this.getCombinedValidatorOutput(value).valid

            if (valid && this.asyncValidatorRunner) {
                this.asyncValidatorRunner.handleInputChange(value)
                valid = false
            }

            onValidChange(valid)
        }
    }

    componentWillUnmount() {
        if (this.asyncValidatorRunner)
            this.asyncValidatorRunner.dispose()
    }

    render() {
        const { name, showValidation, type, children, inputAttributes, validationFeedbackComponent, asyncValidator } = this.props
        const { value, asyncValidationInProgress, asyncValidatorOutput } = this.state

        const combinedOutput = this.getCombinedValidatorOutput(value)

        const syncValid = combinedOutput.valid
        let valid = combinedOutput.valid
        let invalidFeedback = combinedOutput.invalidFeedback

        if (asyncValidator) {
            if (asyncValidatorOutput) {
                valid = valid && asyncValidatorOutput.valid

                if (syncValid) {
                    invalidFeedback = asyncValidatorOutput.invalidFeedback
                }
            } else {
                if (syncValid) {
                    // Waiting for async validation to finish
                    valid = false
                    invalidFeedback = undefined
                }
            }
        }

        return <InputWithFeedback value={value} name={name} type={type}
            children={children}
            valid={valid}
            showValidation={showValidation && !asyncValidationInProgress}
            onChange={this.onChange}
            invalidFeedback={invalidFeedback}
            inputAttributes={inputAttributes}
            validationFeedbackComponent={validationFeedbackComponent} />
    }

}