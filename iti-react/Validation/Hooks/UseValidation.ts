import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Validator, getCombinedValidatorOutput, ValidatorOutput } from './ValidatorCore'
import { AsyncValidator, AsyncValidatorRunner } from './AsyncValidator'
import { ValidationFeedbackProps } from './ValidationFeedback'
import { isEqual } from 'lodash'

export interface UseValidationProps<TValue> {
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

interface UseValidationOptions<TValue> {
    // the value that gets used if neither value nor defaultValue are passed to the component
    fallbackValue: TValue

    props: UseValidationProps<TValue>
}

//interface WithValidationState<TValue> {
//    value: TValue
//    asyncValidationInProgress: boolean
//    showAsyncValidationInProgress: boolean
//    asyncValidatorOutput?: ValidatorOutput
//}

export interface UseValidationOutput<TValue> {
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

export function useValidation<TValue>(
    options: UseValidationOptions<TValue>
): UseValidationOutput<TValue> {
    const {
        fallbackValue,
        props: {
            name,
            onChange,
            showValidation,
            onValidChange,
            validators,
            validationKey,
            asyncValidator,
            onAsyncError,
            onAsyncValidationInProgressChange
        }
    } = options

    let defaultValue
    if (typeof options.props.value !== 'undefined') {
        defaultValue = options.props.value
    } else if (typeof options.props.defaultValue !== 'undefined') {
        defaultValue = options.props.defaultValue
    } else {
        defaultValue = fallbackValue
    }

    const [value, setValue] = useState<TValue>(defaultValue)

    const { asyncValidationInProgress } = useAsyncValidation()

    //        componentDidMount() {
    //            this.recreateAsyncValidatorRunner()
    //            this.forceValidate(this.state.value)
    //        }
    useEffect(() => {
        forceValidate()
    })

    const combinedOutput = getCombinedValidatorOutput(value, validators)

    const synchronousValidatorsValid = combinedOutput.valid
    let valid = synchronousValidatorsValid
    let invalidFeedback = combinedOutput.invalidFeedback

    //if (asyncValidator) {
    //    if (asyncValidatorOutput) {
    //        valid = valid && asyncValidatorOutput.valid

    //        if (synchronousValidatorsValid) {
    //            invalidFeedback = asyncValidatorOutput.invalidFeedback
    //        }
    //    } else {
    //        if (synchronousValidatorsValid) {
    //            // Waiting for async validation to finish
    //            valid = false
    //            invalidFeedback = undefined
    //        }
    //    }
    //}

    return {
        name,
        value,
        valid,
        invalidFeedback: invalidFeedback,
        showValidation,
        asyncValidationInProgress,
        onChange: this.onChange
    }

    //        onChange: (newValue: TValue) => void = newValue => {
    //            const { onChange, onValidChange, name } = this.props

    //            let valid = this.getCombinedValidatorOutput(newValue).valid
    //            if (valid && this.asyncValidatorRunner) {
    //                this.asyncValidatorRunner.handleInputChange(newValue)
    //                valid = false
    //            }

    //            if (onValidChange) onValidChange(name, valid)

    //            this.setState(s => ({ ...s, value: newValue }))

    //            // Do this after setting state.value so that the getDerivedStateFromProps can
    //            // override whatever value we just set.
    //            if (onChange) onChange(newValue)
    //        }

    //        static getDerivedStateFromProps(
    //            nextProps: WithValidationProps<TValue>,
    //            prevState: WithValidationState<TValue>
    //        ) {
    //            if (typeof nextProps.value !== 'undefined') {
    //                return {
    //                    value: nextProps.value
    //                }
    //            }

    //            return null
    //        }

    //        forceValidate(value: TValue) {
    //            const { name, onValidChange } = this.props

    //            let valid = this.getCombinedValidatorOutput(value).valid
    //            if (valid && this.asyncValidatorRunner) {
    //                this.asyncValidatorRunner.handleInputChange(value)
    //                valid = false
    //            }

    //            if (onValidChange) {
    //                onValidChange(name, valid)
    //            }
    //        }

    //        componentDidUpdate(
    //            prevProps: WithValidationProps<TValue>,
    //            prevState: WithValidationState<TValue>
    //        ) {
    //            const { validationKey } = this.props
    //            const { value } = this.state

    //            const keyChanged = prevProps.validationKey !== validationKey
    //            if (keyChanged) {
    //                this.recreateAsyncValidatorRunner()
    //            }

    //            if (!isEqual(value, prevState.value) || keyChanged) {
    //                this.forceValidate(value)
    //            }
    //        }

    //        componentWillUnmount() {
    //            if (this.asyncValidatorRunner) this.asyncValidatorRunner.dispose()

    //            if (typeof this.showAsyncTimer !== 'undefined') {
    //                window.clearTimeout(this.showAsyncTimer)
    //            }
    //        }

    //        render() {
    //            const { showValidation, asyncValidator, name } = this.props
    //            const {
    //                value,
    //                asyncValidationInProgress,
    //                asyncValidatorOutput
    //            } = this.state

    //            const combinedOutput = this.getCombinedValidatorOutput(value)

    //            const syncValid = combinedOutput.valid
    //            let valid = combinedOutput.valid
    //            let invalidFeedback = combinedOutput.invalidFeedback

    //            if (asyncValidator) {
    //                if (asyncValidatorOutput) {
    //                    valid = valid && asyncValidatorOutput.valid

    //                    if (syncValid) {
    //                        invalidFeedback = asyncValidatorOutput.invalidFeedback
    //                    }
    //                } else {
    //                    if (syncValid) {
    //                        // Waiting for async validation to finish
    //                        valid = false
    //                        invalidFeedback = undefined
    //                    }
    //                }
    //            }

    //            const injectedProps: UseValidationOutput<TValue> = {
    //                name,
    //                value,
    //                valid,
    //                invalidFeedback: invalidFeedback,
    //                showValidation,
    //                asyncValidationInProgress,
    //                onChange: this.onChange
    //            }

    //            const ownProps = (this.props as any) as TOwnProps

    //            return <WrappedComponent {...ownProps} {...injectedProps} />
    //        }
    //    }
}
