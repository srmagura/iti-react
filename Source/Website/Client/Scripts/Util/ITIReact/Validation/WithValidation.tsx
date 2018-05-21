﻿import * as React from 'react';

import { Validator, getCombinedValidatorOutput, IValidatorOutput } from './ValidatorCore';
import { AsyncValidator, AsyncValidatorRunner } from './AsyncValidator';
import { IValidationFeedbackProps } from './ValidatedInput';

export interface IWithValidationOptions<TValue> {
    // the value that gets used if neither value nor defaultValue are passed to the component
    defaultValue: TValue
}

export interface IWithValidationProps<TValue> extends React.Props<any> {
    value?: TValue
    defaultValue?: TValue
    onChange?: (value: TValue) => void

    showValidation: boolean
    onValidChange?: (valid: boolean) => void

    validators: Validator<TValue>[]
    asyncValidator?: AsyncValidator<TValue>
    onAsyncError?: (e: any) => void
}

interface IWithValidationState<TValue> {
    value: TValue
    asyncValidationInProgress: boolean
    showAsyncValidationInProgress: boolean
    asyncValidatorOutput?: IValidatorOutput
}

export interface IInjectedProps<TValue = string> extends React.Props<any> {
    value: TValue
    onChange: (value: TValue) => void

    valid: boolean
    showValidation: boolean
    invalidFeedback: React.ReactNode

    inputAttributes?: object
    validationFeedbackComponent?(props: IValidationFeedbackProps): JSX.Element

    asyncValidationInProgress: boolean
    formLevelValidatorOutput?: IValidatorOutput
}

export function withValidation<TOwnProps extends {}, TValue = string>(options: IWithValidationOptions<TValue>) {
    const { defaultValue } = options

    return (WrappedComponent: React.ComponentType<TOwnProps & IInjectedProps<TValue>>) =>
        class extends React.Component<IWithValidationProps<TValue> & TOwnProps, IWithValidationState<TValue>> {
            asyncValidatorRunner?: AsyncValidatorRunner<TValue>

            showAsyncTimer?: number

            constructor(props: IWithValidationProps<TValue> & TOwnProps) {
                super(props)

                let value
                if (typeof (props.value) !== 'undefined') {
                    value = props.value
                } else if (typeof (props.defaultValue) !== 'undefined') {
                    value = props.defaultValue
                } else {
                    value = defaultValue
                }

                this.state = {
                    value: value,
                    asyncValidationInProgress: false,
                    showAsyncValidationInProgress: false,
                    asyncValidatorOutput: undefined,
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
                        validator: asyncValidator as AsyncValidator<TValue>, // why is this annotation needed?
                        onResultReceived: this.onAsyncResultReceived,
                        onInProgressChange: this.onAsyncInProgressChange,
                        onError: this.onAsyncError
                    })
                }

                this.forceValidate(this.state.value)
            }

            getCombinedValidatorOutput(value: TValue) {
                return getCombinedValidatorOutput(value, this.props.validators)
            }

            onChange: (newValue: TValue) => void = newValue => {
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

            static getDerivedStateFromProps(nextProps: IWithValidationProps<TValue>, prevState: IWithValidationState<TValue>) {
                if (typeof nextProps.value !== 'undefined') {
                    // Set state here even if nextProps.value === this.state.value
                    // Otherwise you get incorrect behavior due to asynchronous nature of setState
                    return {
                        value: nextProps.value,
                    }
                }

                return null
            }

            forceValidate(value: TValue) {
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

            componentDidUpdate(prevProps: IWithValidationProps<TValue>, prevState: IWithValidationState<TValue>) {
                const { value } = this.state

                if (prevState.value !== value) {
                    this.forceValidate(value)
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

                const injectedProps: IInjectedProps<TValue> = {
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