import * as React from 'react';

interface IReadOnlyInputProps {
    value: string;
}

export function ReadOnlyInput(props: IReadOnlyInputProps) {
    // tabIndex=-1 means tab key navigation skips over the field
    return <input readOnly className="form-control" value={props.value} tabIndex={-1} />
}