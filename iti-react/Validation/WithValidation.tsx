import React from 'react'
import { Validator, getCombinedValidatorOutput, ValidatorOutput } from './ValidatorCore'
import { AsyncValidator, AsyncValidatorRunner } from './AsyncValidator'
import { ValidationFeedbackProps } from './ValidationFeedback'
import { isEqual } from 'lodash'

export interface WithValidationOptions<TValue> {
    // the value that gets used if neither value nor defaultValue are passed to the component
    defaultValue: TValue
}

export interface WithValidationProps<TValue> {
    name: string

    value?: TValue
    defaultValue?: TValue
    onChange?: (value: TValue) => void

    showValidation: boolean
    onValidChange?: (name: string, valid: boolean) => void

    validators: Validator<TValue>[]

    // If you change the validators or asyncValidator, you must also change the validationKey.
    // Otherwise, WithValidation has no way to know the validators have changed.
    validationKey?: string | number

    asyncValidator?: AsyncValidator<TValue>
    onAsyncError?: (e: any) => void
    onAsyncValidationInProgressChange?: (name: string, inProgress: boolean) => void
}

interface WithValidationState<TValue> {
    value: TValue
    asyncValidationInProgress: boolean
    showAsyncValidationInProgress: boolean
    asyncValidatorOutput?: ValidatorOutput
}

export interface WithValidationInjectedProps<TValue = string> {
    name: string

    value: TValue
    onChange: (value: TValue) => void

    valid: boolean
    showValidation: boolean
    invalidFeedback: React.ReactNode

    validationFeedbackComponent?(props: ValidationFeedbackProps): JSX.Element

    asyncValidationInProgress: boolean
    formLevelValidatorOutput?: ValidatorOutput
}

export function withValidation<TOwnProps extends {}, TValue = string>(
    options: WithValidationOptions<TValue>
) {
    const { defaultValue } = options

    return (
        WrappedComponent: React.ComponentType<
            TOwnProps & WithValidationInjectedProps<TValue>
        >
    ) =>
        class extends React.Component<
            WithValidationProps<TValue> & TOwnProps,
            WithValidationState<TValue>
        > {
            asyncValidatorRunner?: AsyncValidatorRunner<TValue>

            showAsyncTimer?: number

            constructor(props: WithValidationProps<TValue> & TOwnProps) {
                super(props)

                let value
                if (typeof props.value !== 'undefined') {
                    value = props.value
                } else if (typeof props.defaultValue !== 'undefined') {
                    value = props.defaultValue
                } else {
                    value = defaultValue
                }

                this.state = {
                    value: value,
                    asyncValidationInProgress: false,
                    showAsyncValidationInProgress: false,
                    asyncValidatorOutput: undefined
                }
            }

            onAsyncResultReceived = (output: ValidatorOutput) => {
                const { onValidChange, name } = this.props
                const { value } = this.state

                if (onValidChange) {
                    const syncValid = this.getCombinedValidatorOutput(value).valid
                    onValidChange(name, output.valid && syncValid)
                }

                this.setState(s => ({
                    ...s,
                    asyncValidatorOutput: output
                }))
            }

            onAsyncError = (e: any) => {
                // doesn't change the validity at all

                if (this.props.onAsyncError) this.props.onAsyncError(e)
            }

            onAsyncInProgressChange = (inProgress: boolean) => {
                const { name, onAsyncValidationInProgressChange } = this.props

                if (onAsyncValidationInProgressChange) {
                    onAsyncValidationInProgressChange(name, inProgress)
                }

                if (inProgress !== this.state.asyncValidationInProgress) {
                    this.setState(s => ({
                        ...s,
                        asyncValidationInProgress: inProgress,
                        showAsyncValidationInProgress: false
                    }))

                    if (this.showAsyncTimer) window.clearTimeout(this.showAsyncTimer)

                    if (inProgress) {
                        // Only show a "validation in progress" message if the network request is taking over
                        // a second to complete.
                        this.showAsyncTimer = window.setTimeout(() => {
                            this.setState({
                                showAsyncValidationInProgress: true
                            })
                        }, 1000)
                    }
                }
            }

            recreateAsyncValidatorRunner = () => {
                const { asyncValidator } = this.props

                if (this.asyncValidatorRunner) {
                    this.asyncValidatorRunner.dispose()
                    this.asyncValidatorRunner = undefined
                }

                if (asyncValidator) {
                    this.asyncValidatorRunner = new AsyncValidatorRunner({
                        validator: asyncValidator as AsyncValidator<TValue>,
                        onResultReceived: this.onAsyncResultReceived,
                        onInProgressChange: this.onAsyncInProgressChange,
                        onError: this.onAsyncError
                    })
                }
            }

            componentDidMount() {
                this.recreateAsyncValidatorRunner()
                this.forceValidate(this.state.value)
            }

            getCombinedValidatorOutput(value: TValue) {
                return getCombinedValidatorOutput(value, this.props.validators)
            }

            onChange: (newValue: TValue) => void = newValue => {
                const { onChange, onValidChange, name } = this.props

                let valid = this.getCombinedValidatorOutput(newValue).valid
                if (valid && this.asyncValidatorRunner) {
                    this.asyncValidatorRunner.handleInputChange(newValue)
                    valid = false
                }

                if (onValidChange) onValidChange(name, valid)

                this.setState(s => ({ ...s, value: newValue }))

                // Do this after setting state.value so that the getDerivedStateFromProps can
                // override whatever value we just set.
                if (onChange) onChange(newValue)
            }

            static getDerivedStateFromProps(
                nextProps: WithValidationProps<TValue>,
                prevState: WithValidationState<TValue>
            ) {
                if (typeof nextProps.value !== 'undefined') {
                    return {
                        value: nextProps.value
                    }
                }

                return null
            }

            forceValidate(value: TValue) {
                const { name, onValidChange } = this.props

                let valid = this.getCombinedValidatorOutput(value).valid
                if (valid && this.asyncValidatorRunner) {
                    this.asyncValidatorRunner.handleInputChange(value)
                    valid = false
                }

                if (onValidChange) {
                    onValidChange(name, valid)
                }
            }

            componentDidUpdate(
                prevProps: WithValidationProps<TValue>,
                prevState: WithValidationState<TValue>
            ) {
                const { validationKey } = this.props
                const { value } = this.state

                const keyChanged = prevProps.validationKey !== validationKey
                if (keyChanged) {
                    this.recreateAsyncValidatorRunner()
                }

                if (!isEqual(value, prevState.value) || keyChanged) {
                    this.forceValidate(value)
                }
            }

            componentWillUnmount() {
                if (this.asyncValidatorRunner) this.asyncValidatorRunner.dispose()

                if (typeof this.showAsyncTimer !== 'undefined') {
                    window.clearTimeout(this.showAsyncTimer)
                }
            }

            render() {
                const { showValidation, asyncValidator, name } = this.props
                const {
                    value,
                    asyncValidationInProgress,
                    asyncValidatorOutput
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

                const injectedProps: WithValidationInjectedProps<TValue> = {
                    name,
                    value,
                    valid,
                    invalidFeedback: invalidFeedback,
                    showValidation,
                    asyncValidationInProgress,
                    onChange: this.onChange
                }

                const ownProps = (this.props as any) as TOwnProps

                return <WrappedComponent {...ownProps} {...injectedProps} />
            }
        }
}
