import * as React from 'react'
import { PropsWithChildren } from 'react'
import {
    ValidationFeedbackProps,
    getValidationClass,
    ValidationFeedback,
    useControlledValue,
    UseValidationProps,
    useValidation,
    ValidatorOutput
} from '../Validation'
import { defaults } from 'lodash'

interface ValidatedInputProps extends UseValidationProps<string> {
    id?: string
    type?: string

    // This class name will be used *in addition to* form-control and the validation feedback class
    className?: string
    enabled?: boolean

    inputAttributes?: React.DetailedHTMLProps<any, any>
    validationFeedbackComponent?(props: ValidationFeedbackProps): JSX.Element

    formLevelValidatorOutput?: ValidatorOutput
}

export const ValidatedInput = React.memo(
    (props: PropsWithChildren<ValidatedInputProps>) => {
        const {
            id,
            type,
            validators,
            showValidation,
            enabled,
            children,
            name
        } = defaults({ ...props }, { type: 'text', inputAttributes: {}, enabled: true })

        const { value, onChange: _onChange } = useControlledValue<string>({
            value: props.value,
            onChange: props.onChange,
            defaultValue: props.defaultValue,
            fallbackValue: ''
        })

        function onChange(
            e: React.SyntheticEvent<
                HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
            >
        ) {
            _onChange(e.currentTarget.value)
        }

        const { valid, invalidFeedback, asyncValidationInProgress } = useValidation<
            string
        >({
            value,
            name: props.name,
            onValidChange: props.onValidChange,
            validators,
            validationKey: props.validationKey,
            asyncValidator: props.asyncValidator,
            onAsyncError: props.onAsyncError,
            onAsyncValidationInProgressChange: props.onAsyncValidationInProgressChange,
            formLevelValidatorOutput: props.formLevelValidatorOutput
        })

        const classes = ['form-control', getValidationClass(valid, showValidation)]
        if (props.className) classes.push(props.className)
        const className = classes.join(' ')

        const inputAttributes = { ...props.inputAttributes, disabled: !enabled }

        let input: JSX.Element

        if (type && type.toLowerCase() === 'select') {
            input = (
                <select
                    id={id}
                    name={name}
                    className={className}
                    value={value}
                    onChange={onChange}
                    {...inputAttributes}
                >
                    {children}
                </select>
            )
        } else if (type && type.toLowerCase() === 'textarea') {
            input = (
                <textarea
                    id={id}
                    name={name}
                    className={className}
                    value={value}
                    onChange={onChange}
                    {...inputAttributes}
                />
            )
        } else {
            input = (
                <input
                    id={id}
                    name={name}
                    type={type}
                    className={className}
                    value={value}
                    onChange={onChange}
                    {...inputAttributes}
                />
            )
        }

        return (
            <ValidationFeedback
                valid={valid}
                showValidation={showValidation}
                invalidFeedback={invalidFeedback}
                asyncValidationInProgress={asyncValidationInProgress}
            >
                {input}
            </ValidationFeedback>
        )
    }
)
