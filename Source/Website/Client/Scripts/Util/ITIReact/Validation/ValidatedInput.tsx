import * as React from 'react';

import { Validator, getCombinedValidatorOutput, IValidatorOutput } from './ValidatorCore';
import { AsyncValidator, AsyncValidatorRunner } from './AsyncValidator';
import { InputWithFeedback, IValidationFeedbackProps } from './InputWithFeedback';

export interface IValidatedInputProps extends React.Props<any> {
    name: string
    type?: string

    value?: string
    defaultValue?: string
    onChange?: (value: string) => void

    showValidation: boolean
    onValidChange?: (valid: boolean) => void

    validators: Validator[]
    asyncValidator?: AsyncValidator
    onAsyncError?: (e: any) => void

    // attributes to pass through to the <input>, <select>, or <textarea> element
    inputAttributes?: object

    // allows you to customize how validation feedback gets displayed
    validationFeedbackComponent?(props: IValidationFeedbackProps): JSX.Element
    formLevelValidatorOutput?: IValidatorOutput
}

interface IValidatedInputState {
    value: string
    asyncValidationInProgress: boolean
    showAsyncValidationInProgress: boolean
    asyncValidatorOutput?: IValidatorOutput
}

/* Input that accepts an array of validator functions that take the field's value and synchronously
 * return a boolean indicating valid/invalid. */
export class ValidatedInput extends React.Component<IValidatedInputProps, IValidatedInputState> {

    asyncValidatorRunner?: AsyncValidatorRunner

    showAsyncTimer?: number

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
            showAsyncValidationInProgress: false,
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

    onAsyncError = (e: any) => {
        // doesn't change the validity at all

        if (this.props.onAsyncError)
            this.props.onAsyncError(e)
    }

    onAsyncInProgressChange = (inProgress: boolean) => {
        if (inProgress !== this.state.asyncValidationInProgress) {
            this.setState(s => ({
                ...s,
                asyncValidationInProgress: inProgress,
                showAsyncValidationInProgress: false,
            }))

            if (this.showAsyncTimer)
                clearTimeout(this.showAsyncTimer)

            if (inProgress) {
                // Only show a "validation in progress" message if the network request is taking over
                // a second to complete.
                this.showAsyncTimer = setTimeout(() => {
                    this.setState({ showAsyncValidationInProgress: true })
                }, 1000)
            }
        }
    }

    componentDidMount() {
        const { asyncValidator } = this.props

        if (asyncValidator) {
            this.asyncValidatorRunner = new AsyncValidatorRunner({
                validator: asyncValidator,
                onResultReceived: this.onAsyncResultReceived,
                onInProgressChange: this.onAsyncInProgressChange,
                onError: this.onAsyncError
            })
        }

        this.forceValidate(this.state.value)
    }

    getCombinedValidatorOutput(value: string) {
        return getCombinedValidatorOutput(value, this.props.validators)
    }

    onChange: (newValue: string) => void = newValue => {
        const { onChange, onValidChange } = this.props

        let valid = this.getCombinedValidatorOutput(newValue).valid
        if (valid && this.asyncValidatorRunner) {
            this.asyncValidatorRunner.handleInputChange(newValue)
            valid = false
        }

        if (onValidChange)
            onValidChange(valid)

        this.setState(s => ({ ...s, value: newValue }))

        // Do this after setting state.value so that the componentWillReceiveProps can
        // override whatever value we just set.
        if (onChange)
            onChange(newValue)
    }

    componentWillReceiveProps(nextProps: IValidatedInputProps) {
        if (typeof nextProps.value !== 'undefined') {
            if (nextProps.value !== this.state.value)
                this.forceValidate(nextProps.value)

            // Set state here even if nextProps.value === this.state.value
            // Otherwise you get incorrect behavior due to asynchronous nature of setState
            this.setState(s => ({
                ...s,
                value: nextProps.value as string,
            }))
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
        const {
            name, showValidation, type, children, inputAttributes, validationFeedbackComponent, asyncValidator,
            formLevelValidatorOutput
        } = this.props
        const {
            value, asyncValidationInProgress, asyncValidatorOutput,
            showAsyncValidationInProgress
        } = this.state

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
            showValidation={showValidation}
            asyncValidationInProgress={showAsyncValidationInProgress}
            onChange={this.onChange}
            invalidFeedback={invalidFeedback}
            inputAttributes={inputAttributes}
            validationFeedbackComponent={validationFeedbackComponent}
            formLevelValidatorOutput={formLevelValidatorOutput} />
    }

}