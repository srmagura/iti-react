import * as React from 'react';

interface IValidationFeedbackProps extends React.Props<any> {
    valid: boolean;
    showValidation: boolean;
    invalidFeedback: string | JSX.Element | undefined;
}

export class ValidationFeedback extends React.Component<IValidationFeedbackProps, {}> {
    render() {
        const { valid, showValidation, children, invalidFeedback } = this.props;

        let feedback: React.ReactNode = null;

        if (showValidation && !valid)
            feedback = <div className="invalid-feedback">{invalidFeedback}</div>;

        return <div>
            {children}
            {feedback}
        </div>;
    }
}

export function getValidationClass(valid: boolean, showValidation: boolean) {
    if (showValidation) {
        if (valid)
            return 'is-valid';
        else
            return 'is-invalid';
    }

    return '';
}

interface IValidatedInputProps extends React.Props<any> {
    name: string;
    type?: string;

    value?: string;
    onChange?: (value: string) => void;
    defaultValue?: string;

    valid: boolean;
    showValidation: boolean;
    invalidFeedback: string | JSX.Element | undefined;
}

export class ValidatedInput extends React.Component<IValidatedInputProps, {}> {

    static defaultProps = {
        type: 'text',
    }

    constructor(props: IValidatedInputProps) {
        super(props);
    }

    onChange: (e: React.SyntheticEvent<HTMLInputElement | HTMLSelectElement>) => void = e => {
        const value = e.currentTarget.value;

        const { onChange } = this.props;

        if (onChange)
            onChange(value);
    }

    render() {
        const { name, type, value, valid, showValidation, invalidFeedback, children } = this.props;

        const className = 'form-control ' + getValidationClass(valid, showValidation);

        let input: JSX.Element;

        if (type && type.toLowerCase() === 'select') {
            input = <select name={name} className={className}
                value={value} onChange={this.onChange}>
                {children}
            </select>;
        } else {
            input = <input name={name} type={type} className={className}
                value={value}
                onChange={this.onChange} />;
        }

        return <ValidationFeedback valid={valid} showValidation={showValidation} invalidFeedback={invalidFeedback}>
                   {input}
               </ValidationFeedback>;
    }
}


