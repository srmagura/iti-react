import React, { useContext } from 'react'
import { defaults } from 'lodash'
import {
    useFieldValidity,
    Validators,
    fieldValidityIsValid,
    Validator,
    ValidatorOutput,
    UseValidationProps,
    useControlledValue,
    useValidation,
} from '@interface-technologies/iti-react-core'
import { ValidationFeedback } from '../Validation'
import { ItiReactContext } from '../ItiReactContext'
import { ValidatedInput } from './ValidatedInput'

export interface PersonNameInputValue {
    first: string
    middle: string
    last: string
}

export const defaultPersonNameInputValue: PersonNameInputValue = {
    first: '',
    middle: '',
    last: '',
}

const noPartialNamesValidator: Validator<PersonNameInputValue> = (value) => {
    const allSpecified = !!(value.first && value.last)
    const allBlank = !value.first && !value.middle && !value.last

    return {
        valid: allSpecified || allBlank,
        invalidFeedback:
            'Both first and last name must be specified, or all fields must be left blank.',
    }
}

function required(): Validator<PersonNameInputValue> {
    return (value): ValidatorOutput => ({
        valid: !!(value.first && value.last),
        invalidFeedback: 'First and last name are required.',
    })
}

/** Validators for use with [[`PersonNameInput`]]. */
export const PersonNameValidators = {
    required,
}

//
//
//

export type PersonNamePersonNameInputAttributes = Omit<
    React.HTMLProps<HTMLInputElement>,
    'disabled'
>

export type PersonNamePersonNameInputAttributesMap = {
    first: PersonNamePersonNameInputAttributes
    middle: PersonNamePersonNameInputAttributes
    last: PersonNamePersonNameInputAttributes
}

export interface PersonNameInputProps extends UseValidationProps<PersonNameInputValue> {
    individualInputsRequired: boolean

    fluid?: boolean

    /** Defaults to false. */
    showMiddleNameInput?: boolean

    /** Lets you pass attributes to each of the inputs. */
    inputAttributesMap?: Partial<PersonNamePersonNameInputAttributesMap>

    /** Lets you control which of the inputs are enabled. */
    enabledInputs?: ('first' | 'middle' | 'last')[]
}

/**
 * A person name input that displays inputs for first name, middle name (optional), and
 * last name.
 *
 * If we just want first and last name, we will often just use two normal [[`ValidatedInputs`]]
 * instead of `PersonNameInput`.
 */
export const PersonNameInput = React.memo(
    ({
        name,
        showValidation,
        individualInputsRequired,
        showMiddleNameInput = false,
        fluid = false,
        inputAttributesMap: propsInputAttributesMap = {},
        enabledInputs = ['first', 'middle', 'last'],
        ...otherProps
    }: PersonNameInputProps) => {
        const { value, onChange } = useControlledValue<PersonNameInputValue>({
            value: otherProps.value,
            onChange: otherProps.onChange,
            defaultValue: otherProps.defaultValue,
            fallbackValue: defaultPersonNameInputValue,
        })

        const { valid, invalidFeedback, asyncValidationInProgress } =
            useValidation<PersonNameInputValue>({
                value,
                name,
                onValidChange: otherProps.onValidChange,
                validators: [...otherProps.validators, noPartialNamesValidator],
                validationKey: otherProps.validationKey,
                asyncValidator: otherProps.asyncValidator,
                onAsyncError: otherProps.onAsyncError,
                onAsyncValidationInProgressChange:
                    otherProps.onAsyncValidationInProgressChange,
                formLevelValidatorOutput: otherProps.formLevelValidatorOutput,
            })

        const inputAttributesMap: PersonNamePersonNameInputAttributesMap = defaults(
            { ...propsInputAttributesMap },
            {
                prefix: {},
                first: {},
                middle: {},
                last: {},
            }
        )

        const classes = ['person-name-input']
        if (fluid) classes.push('person-name-input-fluid')

        const [onChildValidChange, fieldValidity] = useFieldValidity()

        const { fieldLengths } = useContext(ItiReactContext)
        const firstNameValidators = [Validators.maxLength(fieldLengths.personName.first)]
        const lastNameValidators = [Validators.maxLength(fieldLengths.personName.last)]

        if (individualInputsRequired) {
            firstNameValidators.unshift(Validators.required())
            lastNameValidators.unshift(Validators.required())
        }

        const vProps = { showValidation, onValidChange: onChildValidChange }

        return (
            <ValidationFeedback
                valid={valid}
                invalidFeedback={invalidFeedback}
                showValidation={showValidation && fieldValidityIsValid(fieldValidity)}
                asyncValidationInProgress={asyncValidationInProgress}
            >
                <div className={classes.join(' ')}>
                    <ValidatedInput
                        name={`${name}First`}
                        inputAttributes={{
                            placeholder: 'First',
                            'aria-label': 'First name',
                            ...inputAttributesMap.first,
                        }}
                        enabled={enabledInputs.includes('first')}
                        value={value.first}
                        onChange={(first): void => onChange({ ...value, first })}
                        validators={firstNameValidators}
                        {...vProps}
                    />
                    {showMiddleNameInput && (
                        <ValidatedInput
                            name={`${name}Middle`}
                            inputAttributes={{
                                placeholder: 'Middle',
                                'aria-label': 'Middle name',
                                ...inputAttributesMap.middle,
                            }}
                            enabled={enabledInputs.includes('middle')}
                            value={value.middle}
                            onChange={(middle): void => onChange({ ...value, middle })}
                            // Never required because some people don't have middle names
                            validators={[
                                Validators.maxLength(fieldLengths.personName.middle),
                            ]}
                            {...vProps}
                        />
                    )}
                    <ValidatedInput
                        name={`${name}Last`}
                        inputAttributes={{
                            placeholder: 'Last',
                            'aria-label': 'Last name',
                            ...inputAttributesMap.last,
                        }}
                        enabled={enabledInputs.includes('last')}
                        value={value.last}
                        onChange={(last): void => onChange({ ...value, last })}
                        validators={lastNameValidators}
                        {...vProps}
                    />
                </div>
            </ValidationFeedback>
        )
    }
)
