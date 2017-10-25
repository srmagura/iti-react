import * as React from 'react';

import { ValidatedInput } from './ValidatedInput';

interface IValidatorOutput {
    valid: boolean;
    invalidFeedback?: string;
}

interface ISimpleValidatedInputProps extends React.Props<any> {
    name: string;
    type?: string;

    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;

    showValidation: boolean;
    onValidChange?: (valid: boolean) => void;

    validator(value: string | undefined): IValidatorOutput;
}

interface ISimpleValidatedInputState {
    value?: string;
}

/* Input that accepts a validator function, that takes the field's value and synchronously
 * a boolean indicating valid/invalid. */
export class SimpleValidatedInput extends React.Component<ISimpleValidatedInputProps, ISimpleValidatedInputState> {

    constructor(props: ISimpleValidatedInputProps) {
        super(props);

        this.state = {
            value: props.value ? props.value : props.defaultValue,
        };
    }

    onChange: (value: string) => void = value => {
        const { onChange, onValidChange, validator } = this.props;
        const stateChanges: any = { value };

        if (onChange)
            onChange(value);

        const valid = validator(value).valid;

        if (onValidChange)
            onValidChange(valid);

        stateChanges.valid = valid;

        this.setState(stateChanges);
    }

    render() {
        const { name, showValidation, type, children, validator } = this.props;
        const { value } = this.state;

        const validatorOutput = validator(value);

        return <ValidatedInput value={value} name={name} type={type}
            children={children}
            valid={validatorOutput.valid}
            showValidation={showValidation} onChange={this.onChange}
            invalidFeedback={validatorOutput.invalidFeedback} />;
    }

    componentDidMount() {
        const { onValidChange, validator } = this.props;

        if (onValidChange) {
            onValidChange(validator(this.state.value).valid);
        }
    }
}