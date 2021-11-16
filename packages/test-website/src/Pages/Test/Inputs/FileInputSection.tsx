import React from 'react'
import {
    useFieldValidity,
    FormGroup,
    FileInput,
    FileValidators,
    FileInputValue,
} from '@interface-technologies/iti-react'
import { ValidityLabel } from './ValidityLabel'
import { useState } from 'react'

interface FileInputSectionProps {
    showValidation: boolean
}

export function FileInputSection({
    showValidation,
}: FileInputSectionProps): React.ReactElement {
    const { onChildValidChange, fieldValidity } = useFieldValidity()
    const vProps = {
        showValidation,
        onValidChange: onChildValidChange,
    }

    const [file2, setFile2] = useState<FileInputValue>(null)

    return (
        <div>
            <FormGroup
                label={
                    <span>
                        Not required, uncontrolled{' '}
                        <ValidityLabel valid={fieldValidity.fileInput0} />
                    </span>
                }
            >
                {(id) => (
                    <FileInput
                        id={id}
                        name="fileInput0"
                        accept="*"
                        validators={[]}
                        {...vProps}
                    />
                )}
            </FormGroup>
            <div className="form-group">
                <label>Required, uncontrolled</label>{' '}
                <ValidityLabel valid={fieldValidity.fileInput1} />
                <FileInput
                    name="fileInput1"
                    accept="*"
                    validators={[FileValidators.required()]}
                    {...vProps}
                />
            </div>
            <div className="form-group">
                <label>Required, controlled</label>{' '}
                <ValidityLabel valid={fieldValidity.fileInput2} />
                <FileInput
                    name="fileInput2"
                    accept="*"
                    value={file2}
                    onChange={setFile2}
                    validators={[FileValidators.required()]}
                    {...vProps}
                />
            </div>
        </div>
    )
}
