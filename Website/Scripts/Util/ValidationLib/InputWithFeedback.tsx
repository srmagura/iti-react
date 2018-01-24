import * as React from 'react';

interface IValidationFeedbackProps extends React.Props<any> {
    valid: boolean
    showValidation: boolean
    invalidFeedback: string | JSX.Element | undefined
}

export class ValidationFeedback extends React.Component<IValidationFeedbackProps, {}> {
    render() {
        const { valid, showValidation, children, invalidFeedback } = this.props

        let feedback: React.ReactNode = null

        if (showValidation && !valid)
            feedback = <div className="invalid-feedback">{invalidFeedback}</div>

        return <div>
            {children}
            {feedback}
        </div>
    }
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

interface IValidatedInputProps extends React.Props<any> {
    name: string
    type?: string

    value: string
    onChange: (value: string) => void

    valid: boolean
    showValidation: boolean
    invalidFeedback: string | JSX.Element | undefined

    inputAttributes: object
}

export class InputWithFeedback extends React.Component<IValidatedInputProps, {}> {

    static defaultProps = {
        type: 'text',
    }

    onChange: (e: React.SyntheticEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void = e => {
        const value = e.currentTarget.value

        const { onChange } = this.props

        if (onChange)
            onChange(value)
    }

    render() {
        let { name, type, value, valid, showValidation, invalidFeedback, inputAttributes, children } = this.props
        type = type ? type.toLowerCase() : type

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

        return <ValidationFeedback valid={valid} showValidation={showValidation} invalidFeedback={invalidFeedback}>
                   {input}
               </ValidationFeedback>
    }
}


