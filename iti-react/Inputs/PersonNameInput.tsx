import React, { HTMLAttributes } from 'react'
import { useContext } from 'react'
import { defaults } from 'lodash'
import {
    WithValidationInjectedProps,
    ValidationFeedback,
    withValidation,
    WithValidationProps
} from '../Validation'
import {
    useFieldValidity,
    Validators,
    fieldValidityIsValid,
    Validator,
    ValidatorOutput
} from '@interface-technologies/iti-react-core'
import { ItiReactContext } from '../ItiReactContext'
import { ValidatedInput } from './ValidatedInput'

export interface PersonNameInputValue {
    prefix: string
    first: string
    middle: string
    last: string
}

export const defaultPersonNameInputValue: PersonNameInputValue = {
    prefix: '',
    first: '',
    middle: '',
    last: ''
}

//
//
//

type InputAttributesMap = {
    prefix: React.DetailedHTMLProps<HTMLAttributes<HTMLInputElement>, HTMLInputElement>
    first: React.DetailedHTMLProps<HTMLAttributes<HTMLInputElement>, HTMLInputElement>
    middle: React.DetailedHTMLProps<HTMLAttributes<HTMLInputElement>, HTMLInputElement>
    last: React.DetailedHTMLProps<HTMLAttributes<HTMLInputElement>, HTMLInputElement>
}

interface PersonNameInputOwnProps {
    id?: string
    enabled?: boolean
    individualInputsRequired: boolean

    fluid?: boolean
    showMiddleNameInput?: boolean
    inputAttributesMap?: Partial<InputAttributesMap>
}

type PersonNameInputProps = PersonNameInputOwnProps &
    WithValidationInjectedProps<PersonNameInputValue>

const _PersonNameInput: React.SFC<PersonNameInputProps> = React.memo<
    PersonNameInputProps
>(props => {
    const {
        valid,
        invalidFeedback,
        value,
        onChange,
        name,
        showValidation,
        individualInputsRequired,
        showMiddleNameInput,
        fluid,
        inputAttributesMap: propsInputAttributesMap
    } = defaults(
        { ...props },
        {
            showMiddleNameInput: false,
            fluid: false,
            inputAttributesMap: {}
        }
    )

    const inputAttributesMap: InputAttributesMap = defaults(propsInputAttributesMap, {
        prefix: {},
        first: {},
        middle: {},
        last: {}
    })

    const classes = ['person-name-input']
    if (fluid) classes.push('person-name-input-fluid')

    const [onChildValidChange, fieldValidity] = useFieldValidity()

    const fieldLengths = useContext(ItiReactContext).fieldLengths
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
        >
            <div className={classes.join(' ')}>
                <ValidatedInput
                    name={name + 'First'}
                    inputAttributes={{
                        placeholder: 'First',
                        'aria-label': 'First name',
                        ...inputAttributesMap.first
                    }}
                    value={value.first}
                    onChange={(first): void => onChange({ ...value, first })}
                    validators={firstNameValidators}
                    {...vProps}
                />
                {showMiddleNameInput && (
                    <ValidatedInput
                        name={name + 'Middle'}
                        inputAttributes={{
                            placeholder: 'Middle',
                            'aria-label': 'Middle name',
                            ...inputAttributesMap.middle
                        }}
                        value={value.middle}
                        onChange={(middle): void => onChange({ ...value, middle })}
                        // Never required because some people don't have middle names
                        validators={[
                            Validators.maxLength(fieldLengths.personName.middle)
                        ]}
                        {...vProps}
                    />
                )}
                <ValidatedInput
                    name={name + 'Last'}
                    inputAttributes={{
                        placeholder: 'Last',
                        'aria-label': 'Last name',
                        ...inputAttributesMap.last
                    }}
                    value={value.last}
                    onChange={(last): void => onChange({ ...value, last })}
                    validators={lastNameValidators}
                    showValidation={showValidation}
                    {...vProps}
                />
            </div>
        </ValidationFeedback>
    )
})

//
//
//

const ValidatedPersonNameInput = withValidation<
    PersonNameInputOwnProps,
    PersonNameInputValue
>({
    defaultValue: defaultPersonNameInputValue
})(_PersonNameInput)

//
//
//

const noPartialNamesValidator: Validator<PersonNameInputValue> = value => {
    const allSpecified = !!(value.first && value.last)
    const allBlank = !!(!value.prefix && !value.first && !value.middle && !value.last)

    return {
        valid: allSpecified || allBlank,
        invalidFeedback:
            'Both first and last name must be specified, or all fields must be left blank.'
    }
}

function required(): Validator<PersonNameInputValue> {
    return (value): ValidatorOutput => ({
        valid: !!(value.first && value.last),
        invalidFeedback: 'First and last name are required.'
    })
}

export const PersonNameValidators = {
    required
}

//
//
//

export function PersonNameInput(
    props: WithValidationProps<PersonNameInputValue> & PersonNameInputOwnProps
): React.ReactNode {
    const { validators, ...passThroughProps } = props

    return (
        <ValidatedPersonNameInput
            {...passThroughProps}
            validators={[...validators, noPartialNamesValidator]}
        />
    )
}
