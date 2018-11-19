import * as React from 'react'
import { ValidatorOutput } from './ValidatorCore'
import { ItiReactContext, ItiReactContextData } from '../ItiReactContext'
import { WithValidationInjectedProps, withValidation } from './WithValidation'

export interface ValidationFeedbackProps extends React.Props<any> {
    valid: boolean
    showValidation: boolean
    invalidFeedback: React.ReactNode

    asyncValidationInProgress?: boolean
    renderLoadingIndicator?: () => React.ReactNode
}

export function ValidationFeedback(props: ValidationFeedbackProps) {
    const {
        valid,
        showValidation,
        children,
        invalidFeedback,
        asyncValidationInProgress,
        renderLoadingIndicator
    } = props

    let feedback: React.ReactNode

    if (showValidation && asyncValidationInProgress) {
        if (renderLoadingIndicator) {
            feedback = (
                <div className="in-progress-feedback">
                    {renderLoadingIndicator()} Validating...
                </div>
            )
        } else {
            feedback = <div className="in-progress-feedback">Validating...</div>
        }
    } else if (showValidation && !valid && invalidFeedback) {
        // invalid-feedback has a margin, so do not render it if invalidFeedback is empty
        feedback = <div className="invalid-feedback">{invalidFeedback}</div>
    }

    return (
        <div>
            {children}
            {feedback}
        </div>
    )
}

ValidationFeedback.defaultProps = {
    asyncValidationInProgress: false
}

export function getValidationClass(valid: boolean, showValidation: boolean) {
    if (showValidation) {
        if (valid) return 'is-valid'
        else return 'is-invalid'
    }

    return ''
}

interface InputWithFeedbackOwnProps extends React.Props<any> {
    id?: string
    type?: string

    inputAttributes?: object
    validationFeedbackComponent?(props: ValidationFeedbackProps): JSX.Element

    formLevelValidatorOutput?: ValidatorOutput
}

type InputWithFeedbackProps = InputWithFeedbackOwnProps & WithValidationInjectedProps

class InputWithFeedback extends React.PureComponent<InputWithFeedbackProps, {}> {
    static defaultProps = {
        type: 'text',
        inputAttributes: {}
    }

    onChange: (
        e: React.SyntheticEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => void = e => {
        const value = e.currentTarget.value

        const { onChange } = this.props

        if (onChange) onChange(value)
    }

    render() {
        let {
            id,
            name,
            type,
            value,
            valid,
            showValidation,
            invalidFeedback,
            inputAttributes,
            children,
            validationFeedbackComponent,
            formLevelValidatorOutput,
            asyncValidationInProgress
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
            input = (
                <select
                    id={id}
                    name={name}
                    className={className}
                    value={value}
                    onChange={this.onChange}
                    {...inputAttributes}
                >
                    {children}
                </select>
            )
        } else if (type === 'textarea') {
            input = (
                <textarea
                    id={id}
                    name={name}
                    className={className}
                    value={value}
                    onChange={this.onChange}
                    {...inputAttributes}
                />
            )
        } else {
            input = (
                <input
                    id={id}
                    name={name}
                    type={type}
                    className={className}
                    value={value}
                    onChange={this.onChange}
                    {...inputAttributes}
                />
            )
        }

        const ValidationFeedbackComponent = validationFeedbackComponent
            ? validationFeedbackComponent
            : ValidationFeedback

        return (
            <ItiReactContext.Consumer>
                {(data: ItiReactContextData) => (
                    <ValidationFeedbackComponent
                        valid={valid}
                        showValidation={showValidation}
                        invalidFeedback={invalidFeedback}
                        asyncValidationInProgress={asyncValidationInProgress}
                        renderLoadingIndicator={data.renderLoadingIndicator}
                    >
                        {input}
                    </ValidationFeedbackComponent>
                )}
            </ItiReactContext.Consumer>
        )
    }
}

export const ValidatedInput = withValidation<InputWithFeedbackOwnProps>({
    defaultValue: ''
})(InputWithFeedback)
