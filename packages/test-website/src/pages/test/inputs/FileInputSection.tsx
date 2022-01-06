import {
    useFieldValidity,
    FileInput,
    FileValidators,
    FileInputValue,
    Validator,
} from '@interface-technologies/iti-react'
import { ReactElement, useState } from 'react'
import { TestFormGroup } from './TestFormGroup'

const imageValidator: Validator<FileInputValue> = (value) => {
    if (!value) return undefined
    if (!value.type.startsWith('image/')) return 'File is not an image.'
    return undefined
}

interface FileInputSectionProps {
    showValidation: boolean
}

export function FileInputSection({
    showValidation,
}: FileInputSectionProps): ReactElement {
    const { onChildValidChange, fieldValidity } = useFieldValidity()
    const vProps = {
        showValidation,
        onValidChange: onChildValidChange,
    }

    const [file2, setFile2] = useState<FileInputValue>(null)

    const [file3, setFile3] = useState<FileInputValue>(null)
    const [previewImageSrc, setPreviewImageSrc] = useState<string>()

    function onFile3Change(file: FileInputValue): void {
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
        <div className="file-input-section">
            <TestFormGroup
                label="Not required, uncontrolled"
                valid={fieldValidity.fileInput0}
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
            </TestFormGroup>
            <TestFormGroup
                label="Required, uncontrolled"
                valid={fieldValidity.fileInput1}
            >
                {(id) => (
                    <FileInput
                        id={id}
                        name="fileInput1"
                        accept="*"
                        validators={[FileValidators.required()]}
                        {...vProps}
                    />
                )}
            </TestFormGroup>
            <TestFormGroup label="Required, controlled" valid={fieldValidity.fileInput2}>
                {(id) => (
                    <div className="d-flex align-items-start">
                        <FileInput
                            id={id}
                            name="fileInput2"
                            accept="*"
                            value={file2}
                            onChange={setFile2}
                            validators={[FileValidators.required()]}
                            {...vProps}
                        />
                        <button
                            className="ms-3 btn btn-secondary"
                            type="button"
                            onClick={() => setFile2(null)}
                        >
                            Clear
                        </button>
                    </div>
                )}
            </TestFormGroup>
            <TestFormGroup
                label="Image required, controlled"
                valid={fieldValidity.fileInput3}
            >
                {(id) => (
                    <FileInput
                        id={id}
                        name="fileInput3"
                        accept="image/*"
                        value={file3}
                        onChange={onFile3Change}
                        validators={[FileValidators.required(), imageValidator]}
                        {...vProps}
                    />
                )}
            </TestFormGroup>
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
