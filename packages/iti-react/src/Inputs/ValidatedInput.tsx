﻿import React from 'react'
import {
    useControlledValue,
    UseValidationProps,
    useValidation,
} from '@interface-technologies/iti-react-core'
import { getValidationClass, ValidationFeedback } from '../Validation'

export type ValidatedInputOmittedHtmlProps =
    | 'id'
    | 'name'
    | 'class'
    | 'disabled'
    | 'value'
    | 'onChange'

export interface ValidatedInputProps extends UseValidationProps<string> {
    id?: string
    type?: string

    /**
     * This class name will be used **in addition to** `form-control` and the
     * validation feedback class.
     */
    className?: string
    enabled?: boolean

    inputAttributes?:
        | Omit<React.HTMLProps<HTMLInputElement>, ValidatedInputOmittedHtmlProps>
        | Omit<React.HTMLProps<HTMLTextAreaElement>, ValidatedInputOmittedHtmlProps>
}

export const ValidatedInput = React.memo(
    ({
        id,
        type = 'text',
        showValidation,
        enabled = true,
        name,
        ...otherProps
    }: ValidatedInputProps) => {
        const { value, onChange: _onChange } = useControlledValue<string>({
            value: otherProps.value,
            onChange: otherProps.onChange,
            defaultValue: otherProps.defaultValue,
            fallbackValue: '',
        })

        function onChange(
            e: React.SyntheticEvent<
                HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
            >
        ): void {
            _onChange(e.currentTarget.value)
        }

        const validatorOutput = useValidation<string>({
            value,
            name,
            onValidChange: otherProps.onValidChange,
            validators: otherProps.validators,
            validationKey: otherProps.validationKey,
            asyncValidator: otherProps.asyncValidator,
            onAsyncError: otherProps.onAsyncError,
            formLevelValidatorOutput: otherProps.formLevelValidatorOutput,
        })

        const classes = [
            getValidationClass(!validatorOutput, showValidation),
            'form-control',
        ]
        if (otherProps.className) classes.push(otherProps.className)

        const inputAttributes = { ...otherProps.inputAttributes, disabled: !enabled }

        let input: JSX.Element

        if (type && type.toLowerCase() === 'textarea') {
            input = (
                <textarea
                    id={id}
                    name={name}
                    className={classes.join(' ')}
                    value={value}
                    onChange={onChange}
                    {...(inputAttributes as React.HTMLProps<HTMLTextAreaElement>)}
                />
            )
        } else {
            input = (
                <input
                    id={id}
                    name={name}
                    type={type}
                    className={classes.join(' ')}
                    value={value}
                    onChange={onChange}
                    {...(inputAttributes as React.HTMLProps<HTMLInputElement>)}
                />
            )
        }

        return (
            <ValidationFeedback
                validatorOutput={validatorOutput}
                showValidation={showValidation}
            >
                {input}
            </ValidationFeedback>
        )
    }
)