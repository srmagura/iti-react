import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Validator, getCombinedValidatorOutput, ValidatorOutput } from './ValidatorCore'
import { AsyncValidator, AsyncValidatorRunner } from './AsyncValidator'
import { ValidationFeedbackProps } from './ValidationFeedback'
import { isEqual } from 'lodash'

export function useAsyncValidator() {
    const [asyncValidationInProgress, setAsyncValidationInProgress] = useState(false)
    //        asyncValidatorRunner?: AsyncValidatorRunner<TValue>

    //        showAsyncTimer?: number

    //        constructor(props: WithValidationProps<TValue> & TOwnProps) {
    //            super(props)

    //            this.state = {
    //                value: value,
    //                asyncValidationInProgress: false,
    //                showAsyncValidationInProgress: false,
    //                asyncValidatorOutput: undefined
    //            }
    //        }

    //        componentDidMount() {
    //            this.recreateAsyncValidatorRunner()
    //        }

    //        onAsyncResultReceived = (output: ValidatorOutput) => {
    //            const { onValidChange, name } = this.props
    //            const { value } = this.state

    //            if (onValidChange) {
    //                const syncValid = this.getCombinedValidatorOutput(value).valid
    //                onValidChange(name, output.valid && syncValid)
    //            }

    //            this.setState(s => ({
    //                ...s,
    //                asyncValidatorOutput: output
    //            }))
    //        }

    //        onAsyncError = (e: any) => {
    //            // doesn't change the validity at all

    //            if (this.props.onAsyncError) this.props.onAsyncError(e)
    //        }

    //        onAsyncInProgressChange = (inProgress: boolean) => {
    //            const { name, onAsyncValidationInProgressChange } = this.props

    //            if (onAsyncValidationInProgressChange) {
    //                onAsyncValidationInProgressChange(name, inProgress)
    //            }

    //            if (inProgress !== this.state.asyncValidationInProgress) {
    //                this.setState(s => ({
    //                    ...s,
    //                    asyncValidationInProgress: inProgress,
    //                    showAsyncValidationInProgress: false
    //                }))

    //                if (this.showAsyncTimer) window.clearTimeout(this.showAsyncTimer)

    //                if (inProgress) {
    //                    // Only show a "validation in progress" message if the network request is taking over
    //                    // a second to complete.
    //                    this.showAsyncTimer = window.setTimeout(() => {
    //                        this.setState({
    //                            showAsyncValidationInProgress: true
    //                        })
    //                    }, 1000)
    //                }
    //            }
    //        }

    //        recreateAsyncValidatorRunner = () => {
    //            const { asyncValidator } = this.props

    //            if (this.asyncValidatorRunner) {
    //                this.asyncValidatorRunner.dispose()
    //                this.asyncValidatorRunner = undefined
    //            }

    //            if (asyncValidator) {
    //                this.asyncValidatorRunner = new AsyncValidatorRunner({
    //                    validator: asyncValidator as AsyncValidator<TValue>,
    //                    onResultReceived: this.onAsyncResultReceived,
    //                    onInProgressChange: this.onAsyncInProgressChange,
    //                    onError: this.onAsyncError
    //                })
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

    return { asyncValidationInProgress }
}
