import React from 'react'
import {
    Validators,
    UseValidationProps,
    Validator,
    useControlledValue,
    useValidation,
    ValidatorOutput,
} from '@interface-technologies/iti-react-core'
import { ValidationFeedback } from '../../Validation'
import { RadioOption, RadioInputValue } from './RadioInputTypes'
import { RadioButton } from './RadioButton'

const classSeparator = '__'

export interface RadioButtonOptions {
    inline: boolean
}

export interface RadioInputProps extends UseValidationProps<RadioInputValue> {
    options: RadioOption[]

    enabled?: boolean
    buttonOptions?: Partial<RadioButtonOptions>
}

/**
 * Radio button input. It renders a group of radio buttons based on the `options` you
 * pass in.
 *
 * You can customize the style of both the container and the individual radio buttons
 * / labels. Use the devtools element inspector to see the class names you need to
 * target.
 */
export const RadioInput = React.memo<RadioInputProps>(
    ({ options, enabled = true, showValidation, name, ...props }) => {
        const { value, onChange } = useControlledValue<RadioInputValue>({
            value: props.value,
            onChange: props.onChange,
            defaultValue: props.defaultValue,
            fallbackValue: null,
        })

        const validatorOutput = useValidation<RadioInputValue>({
            value,
            name,
            onValidChange: props.onValidChange,
            validators: props.validators,
            validationKey: props.validationKey,
            asyncValidator: props.asyncValidator,
            onAsyncError: props.onAsyncError,
            formLevelValidatorOutput: props.formLevelValidatorOutput,
        })

        const buttonOptions: RadioButtonOptions = {
            inline: true,
            ...props.buttonOptions,
        }

        const containerClass = 'radio-button-container'
        const containerClasses = [containerClass, name + classSeparator + containerClass]

        return (
            <ValidationFeedback
                validatorOutput={validatorOutput}
                showValidation={showValidation}
            >
                <div className={containerClasses.join(' ')}>
                    {options.map((o) => (
                        <RadioButton
                            radioOption={o}
                            name={name}
                            value={value}
                            onChange={onChange}
                            enabled={enabled}
                            inline={buttonOptions.inline}
                            key={o.value}
                        />
                    ))}
                </div>
            </ValidationFeedback>
        )
    }
)

function required(): Validator<RadioInputValue> {
    return (value) => {
        if (value === null) return Validators.required()('')

        return undefined
    }
}

export const RadioValidators = {
    required,
}
