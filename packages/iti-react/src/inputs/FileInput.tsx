import React, { useEffect, useRef } from 'react'
import {
    useControlledValue,
    useValidation,
    UseValidationProps,
    Validator,
    Validators,
} from '@interface-technologies/iti-react-core'
import { getValidationClass, ValidationFeedback } from '../validation'

export type FileInputValue = File | null

export interface FileInputProps extends UseValidationProps<FileInputValue> {
    id?: string

    /**
     * `file_extension|audio/*|video/*|image/*|media_type`
     *
     * Passed directly to the underlying `input` element.
     */
    accept: string
    inputAttributes?: React.HTMLProps<HTMLInputElement>
    enabled?: boolean
}

/**
 * A file upload control that can be made a required field.
 */
export function FileInput({
    id,
    accept,
    enabled = true,
    showValidation,
    name,
    ...props
}: FileInputProps): React.ReactElement {
    const { value, onChange } = useControlledValue<FileInputValue>({
        value: props.value,
        onChange: props.onChange,
        defaultValue: props.defaultValue,
        fallbackValue: null,
    })

    const validatorOutput = useValidation<FileInputValue>({
        value,
        name,
        onValidChange: props.onValidChange,
        validators: props.validators,
        validationKey: props.validationKey,
        asyncValidator: props.asyncValidator,
        onAsyncError: props.onAsyncError,
        formLevelValidatorOutput: props.formLevelValidatorOutput,
    })

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!inputRef.current) return

        if (value === null && inputRef.current.value) {
            inputRef.current.value = ''
        }
    }, [value])

    const inputClasses = [
        getValidationClass(!validatorOutput, showValidation),
        'form-control',
    ]
    if (props.inputAttributes?.className)
        inputClasses.push(props.inputAttributes.className)

    const inputAttributes = {
        ...props.inputAttributes,
        disabled: !enabled,
        className: inputClasses.join(' '),
    }

    return (
        <ValidationFeedback
            validatorOutput={validatorOutput}
            showValidation={showValidation}
        >
            <input
                {...inputAttributes}
                id={id}
                ref={inputRef}
                type="file"
                name={name}
                accept={accept}
                onChange={(e) => {
                    const files = e.target?.files

                    if (files && files[0]) {
                        onChange(files[0])
                    } else {
                        onChange(null)
                    }
                }}
            />
        </ValidationFeedback>
    )
}

function required(): Validator<FileInputValue> {
    return (value) => {
        if (!value) return Validators.required()('')

        return undefined
    }
}

/** For use with [[`FileInput`]]. */
export const FileValidators = { required }
