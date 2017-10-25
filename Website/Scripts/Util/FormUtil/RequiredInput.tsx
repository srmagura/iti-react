import * as React from 'react';

import { SimpleValidatedInput } from './SimpleValidatedInput';

interface IRequiredInputProps extends React.Props<any> {
    name: string;
    type?: string;

    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;

    showValidation: boolean;
    onValidChange?: (valid: boolean) => void;
}

export function RequiredInput(props: IRequiredInputProps) {
    function validator(value: string | undefined) {
        return {
            valid: !!value,
            invalidFeedback: 'This field is required.'
        };
    }

    return <SimpleValidatedInput {...props} validator={validator}/>;
}