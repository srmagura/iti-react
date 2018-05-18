import * as React from 'react';

import { Validator, getCombinedValidatorOutput, IValidatorOutput } from './ValidatorCore';
import { AsyncValidator, AsyncValidatorRunner } from './AsyncValidator';
import { InputWithFeedback, IValidationFeedbackProps } from './InputWithFeedback';

export interface IWithValidationProps extends React.Props<any> {
    value?: string
    defaultValue?: string
    onChange?: (value: string) => void

    showValidation: boolean
    onValidChange?: (valid: boolean) => void

    validators: Validator[]
    asyncValidator?: AsyncValidator
    onAsyncError?: (e: any) => void
}

interface IWithValidationState {
    value: string
    asyncValidationInProgress: boolean
    showAsyncValidationInProgress: boolean
    asyncValidatorOutput?: IValidatorOutput

    forceValidate: boolean
}

export interface IInjectedProps extends React.Props<any> {
    value: string
    onChange: (value: string) => void

    valid: boolean
    showValidation: boolean
    invalidFeedback: React.ReactNode

    inputAttributes?: object
    validationFeedbackComponent?(props: IValidationFeedbackProps): JSX.Element

    asyncValidationInProgress: boolean
    formLevelValidatorOutput?: IValidatorOutput
}

export function withValidation<TOwnProps extends {}>(WrappedComponent: React.ComponentType<TOwnProps & IInjectedProps>) {
    return class extends React.Component<IWithValidationProps & TOwnProps, IWithValidationState> {
        asyncValidatorRunner?: AsyncValidatorRunner

        showAsyncTimer?: number

        constructor(props: IWithValidationProps & TOwnProps) {
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
                asyncValidatorOutput: undefined,
                forceValidate: false,
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
                    validator: asyncValidator as AsyncValidator<string>, // why is this annotation needed?
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

        static getDerivedStateFromProps(nextProps: IWithValidationProps, prevState: IWithValidationState) {
            if (typeof nextProps.value !== 'undefined') {
                // Set state here even if nextProps.value === this.state.value
                // Otherwise you get incorrect behavior due to asynchronous nature of setState
                return {
                    value: nextProps.value as string,
                    forceValidate: nextProps.value !== prevState.value
                }
            }

            return null
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

        componentDidUpdate(prevProps: IWithValidationProps, prevState: IWithValidationState) {
            const { forceValidate } = prevState

            if (forceValidate) {
                this.forceValidate(prevState.value)
            }
        }

        componentWillUnmount() {
            if (this.asyncValidatorRunner)
                this.asyncValidatorRunner.dispose()
        }

        render() {
            const { showValidation, asyncValidator } = this.props
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

            const injectedProps: IInjectedProps = {
                value,
                valid,
                invalidFeedback: invalidFeedback,
                showValidation,
                asyncValidationInProgress,
                onChange: this.onChange,
            }

            const ownProps = this.props as any as TOwnProps

            return <WrappedComponent
                {...ownProps}
                {...injectedProps} />
        }
    }
}
