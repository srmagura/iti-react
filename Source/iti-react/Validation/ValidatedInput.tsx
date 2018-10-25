import * as React from 'react'
import { ValidatorOutput } from './ValidatorCore'
import { ITIReactContext, ITIReactContextData } from '../ITIReactContext'
import { WithValidationInjectedProps, withValidation } from './WithValidation'

export interface ValidationFeedbackProps extends React.Props<any> {
    valid: boolean
    showValidation: boolean
    invalidFeedback: React.ReactNode

    asyncValidationInProgress?: boolean
    loadingIndicatorComponent?: React.StatelessComponent<{}>
}

export const ValidationFeedback: React.SFC<ValidationFeedbackProps> = props => {
    const {
        valid,
        showValidation,
        children,
        invalidFeedback,
        asyncValidationInProgress
    } = props

    const LoadingIndicatorComponent = props.loadingIndicatorComponent
    let feedback: React.ReactNode

    if (showValidation && asyncValidationInProgress) {
        if (LoadingIndicatorComponent) {
            feedback = (
                <div className="in-progress-feedback">
                    <LoadingIndicatorComponent /> Validating...
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
    type?: string

    inputAttributes?: object
    validationFeedbackComponent?(props: ValidationFeedbackProps): JSX.Element

    formLevelValidatorOutput?: ValidatorOutput
}

type InputWithFeedbackProps = InputWithFeedbackOwnProps & WithValidationInjectedProps

class InputWithFeedback extends React.Component<InputWithFeedbackProps, {}> {
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
            <ITIReactContext.Consumer>
                {(data: ITIReactContextData) => (
                    <ValidationFeedbackComponent
                        valid={valid}
                        showValidation={showValidation}
                        invalidFeedback={invalidFeedback}
                        asyncValidationInProgress={asyncValidationInProgress}
                        loadingIndicatorComponent={data.loadingIndicatorComponent}
                    >
                        {input}
                    </ValidationFeedbackComponent>
                )}
            </ITIReactContext.Consumer>
        )
    }
}

export const ValidatedInput = withValidation<InputWithFeedbackOwnProps>({
    defaultValue: ''
})(InputWithFeedback)
