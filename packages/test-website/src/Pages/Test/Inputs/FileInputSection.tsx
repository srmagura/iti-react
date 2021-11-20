import React from 'react'
import {
    useFieldValidity,
    FormGroup,
    FileInput,
    FileValidators,
    FileInputValue,
    Validator,
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

    const [file3, setFile3] = useState<FileInputValue>(null)
    const [previewImageSrc, setPreviewImageSrc] = useState<string>()
    function onFile3Change(file: FileInputValue) {
        setFile3(file)

        if (file && file.type.startsWith('image/')) {
            // Set previewImageSrc
            const reader = new FileReader()

            reader.onload = () => {
                if (reader.result) {
                    setPreviewImageSrc(reader.result as string)
                }
            }

            reader.readAsDataURL(file)
        } else {
            setPreviewImageSrc(undefined)
        }
    }

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
            <div className="form-group">
                <label>Image required, controlled</label>{' '}
                <ValidityLabel valid={fieldValidity.fileInput3} />
                <FileInput
                    name="fileInput3"
                    accept="image/*"
                    value={file3}
                    onChange={onFile3Change}
                    validators={[FileValidators.required(), imageValidator]}
                    {...vProps}
                />
            </div>
            {previewImageSrc && (
                <img
                    src={previewImageSrc}
                    alt="Preview"
                    style={{ maxWidth: '100%', margin: '0.5rem 0' }}
                />
            )}
        </div>
    )
}

const imageValidator: Validator<FileInputValue> = (value: FileInputValue) => {
    if (!value) return undefined
    if (!value.type.startsWith('image/')) return 'File is not an image.'
    return undefined
}
