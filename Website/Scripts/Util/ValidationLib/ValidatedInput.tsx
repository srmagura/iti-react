import * as React from 'react';

import { InputWithFeedback } from './InputWithFeedback';

interface IValidatorOutput {
    valid: boolean;
    invalidFeedback?: string;
}

interface IValidatedInputProps extends React.Props<any> {
    name: string;
    type?: string;

    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;

    showValidation: boolean;
    onValidChange?: (valid: boolean) => void;

    validators: ((value: string) => IValidatorOutput)[];
}

interface IValidatedInputState {
    value: string;
}

/* Input that accepts a validator function, that takes the field's value and synchronously
 * a boolean indicating valid/invalid. */
export class ValidatedInput extends React.Component<IValidatedInputProps, IValidatedInputState> {

    constructor(props: IValidatedInputProps) {
        super(props);

        if (typeof(props.value) === 'undefined' && typeof(props.defaultValue) === 'undefined')
            throw new Error("Must specify value or defaultValue");

        this.state = {
            value: (props.value ? props.value : props.defaultValue) as string
        };
    }

    getCombinedValidatorOutput(value: string) {
        let output: IValidatorOutput = {
            valid: true,
            invalidFeedback: undefined
        };

        for (const validator of this.props.validators) {
            const _output = validator(value);
            output.valid = output.valid && _output.valid;

            if (!output.invalidFeedback && !_output.valid)
                output.invalidFeedback = _output.invalidFeedback;
        }

        return output;
    }

    onChange: (value: string) => void = value => {
        const { onChange, onValidChange } = this.props;
        const stateChanges: any = { value };

        if (onChange)
            onChange(value);

        const valid = this.getCombinedValidatorOutput(value).valid;

        if (onValidChange)
            onValidChange(valid);

        stateChanges.valid = valid;

        this.setState(stateChanges);
    }

    render() {
        const { name, showValidation, type, children } = this.props;
        const { value } = this.state;

        const validatorOutput = this.getCombinedValidatorOutput(value);

        return <InputWithFeedback value={value} name={name} type={type}
            children={children}
            valid={validatorOutput.valid}
            showValidation={showValidation} onChange={this.onChange}
            invalidFeedback={validatorOutput.invalidFeedback} />;
    }

    componentDidMount() {
        const { onValidChange } = this.props;

        if (onValidChange) {
            onValidChange(this.getCombinedValidatorOutput(this.state.value).valid);
        }
    }
}