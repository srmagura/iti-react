﻿import * as React from 'react';
import { IValidatorOutput } from './ValidatorCore';

export interface IValidationFeedbackProps extends React.Props<any> {
    valid: boolean
    showValidation: boolean
    invalidFeedback: React.ReactNode

    asyncValidationInProgress: boolean
    loadingIndicatorComponent?(): JSX.Element
}

export function ValidationFeedback(props: IValidationFeedbackProps) {
    const {
        valid, showValidation, children, invalidFeedback,
        asyncValidationInProgress, loadingIndicatorComponent
    } = props

    let feedback: React.ReactNode = null

    if (showValidation && asyncValidationInProgress) {
        if (loadingIndicatorComponent) {
            feedback = <div className="in-progress-feedback">
                {loadingIndicatorComponent()}{' '}Validating...
               </div>
        } else {
            feedback = <div className="in-progress-feedback">
                Validating...
              </div>
        }
    } else if (showValidation && !valid) {
        feedback = <div className="invalid-feedback">{invalidFeedback}</div>
    }

    return <div>
        {children}
        {feedback}
    </div>
}

export function getValidationClass(valid: boolean, showValidation: boolean) {
    if (showValidation) {
        if (valid)
            return 'is-valid'
        else
            return 'is-invalid'
    }

    return ''
}

interface IInputWithFeedbackProps extends React.Props<any> {
    name: string
    type?: string

    value: string
    onChange: (value: string) => void

    valid: boolean
    showValidation: boolean
    invalidFeedback: React.ReactNode

    inputAttributes?: object
    validationFeedbackComponent?(props: IValidationFeedbackProps): JSX.Element

    asyncValidationInProgress: boolean
    loadingIndicatorComponent?(): JSX.Element

    formLevelValidatorOutput?: IValidatorOutput
}

export class InputWithFeedback extends React.Component<IInputWithFeedbackProps, {}> {

    static defaultProps = {
        type: 'text',
        inputAttributes: {}
    }

    onChange: (e: React.SyntheticEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void = e => {
        const value = e.currentTarget.value

        const { onChange } = this.props

        if (onChange)
            onChange(value)
    }

    render() {
        let { name, type, value, valid, showValidation,
            invalidFeedback, inputAttributes, children,
            validationFeedbackComponent, formLevelValidatorOutput,
            loadingIndicatorComponent, asyncValidationInProgress
        } = this.props
        type = type ? type.toLowerCase() : type

        // only show form-level validation output if other validators return valid
        if (valid && formLevelValidatorOutput && !formLevelValidatorOutput.valid) {
            valid = formLevelValidatorOutput.valid
            invalidFeedback = formLevelValidatorOutput.invalidFeedback
        }

        const className = 'form-control ' + getValidationClass(valid, showValidation)

        let input: JSX.Element

        if (type === 'select') {
            input = <select name={name} className={className}
                value={value} onChange={this.onChange}
                {...inputAttributes}>
                {children}
            </select>
        } else if (type === 'textarea') {
            input = <textarea name={name} className={className}
                value={value}
                onChange={this.onChange}
                {...inputAttributes} />
        } else {
            input = <input name={name} type={type} className={className}
                value={value}
                onChange={this.onChange}
                {...inputAttributes} />
        }

        const ValidationFeedbackComponent =
            validationFeedbackComponent ? validationFeedbackComponent : ValidationFeedback

        return <ValidationFeedbackComponent
            valid={valid}
            showValidation={showValidation}
            invalidFeedback={invalidFeedback}
            asyncValidationInProgress={asyncValidationInProgress}
            loadingIndicatorComponent={loadingIndicatorComponent}>
            {input}
        </ValidationFeedbackComponent>
    }
}


