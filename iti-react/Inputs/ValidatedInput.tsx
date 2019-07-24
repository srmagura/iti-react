import * as React from 'react'
import { ValidatorOutput } from '../Validation/ValidatorCore'
import { ItiReactContext, ItiReactContextData } from '../ItiReactContext'
import { WithValidationInjectedProps, withValidation } from '../Validation/WithValidation'
import {
    ValidationFeedbackProps,
    getValidationClass,
    ValidationFeedback
} from '../Validation'

interface InputWithFeedbackOwnProps {
    id?: string
    type?: string

    // This class name will be used *in addition to* form-control and the validation feedback class
    className?: string
    enabled?: boolean

    inputAttributes?: React.DetailedHTMLProps<any, any>
    validationFeedbackComponent?(props: ValidationFeedbackProps): JSX.Element

    formLevelValidatorOutput?: ValidatorOutput
}

type InputWithFeedbackProps = InputWithFeedbackOwnProps & WithValidationInjectedProps

class _ValidatedInput extends React.PureComponent<InputWithFeedbackProps, {}> {
    static defaultProps: Pick<InputWithFeedbackOwnProps, 'type' | 'inputAttributes'> = {
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
            children,
            validationFeedbackComponent,
            formLevelValidatorOutput,
            asyncValidationInProgress
        } = this.props
        const inputAttributes = { ...this.props.inputAttributes! }

        type = type ? type.toLowerCase() : type

        // only show form-level validation output if other validators return valid
        if (valid && formLevelValidatorOutput && !formLevelValidatorOutput.valid) {
            valid = formLevelValidatorOutput.valid
            invalidFeedback = formLevelValidatorOutput.invalidFeedback
        }

        const classes = ['form-control', getValidationClass(valid, showValidation)]
        if (this.props.className) classes.push(this.props.className)
        const className = classes.join(' ')

        if (typeof this.props.enabled !== 'undefined') {
            inputAttributes.disabled = !this.props.enabled
        }

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
})(_ValidatedInput)
