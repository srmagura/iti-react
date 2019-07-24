import * as React from 'react'
import { useContext } from 'react'
import {
    ValidatedInput,
    Validators,
    WithValidationInjectedProps,
    withValidation,
    ItiReactContext,
    Validator,
    WithValidationProps,
    ValidationFeedback,
    useFieldValidity,
    fieldValidityIsValid
} from '@interface-technologies/iti-react'
import { defaults } from 'lodash'

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
    prefix: React.DetailedHTMLProps<any, any>
    first: React.DetailedHTMLProps<any, any>
    middle: React.DetailedHTMLProps<any, any>
    last: React.DetailedHTMLProps<any, any>
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
        individualInputsRequired
    } = props
    const showMiddleNameInput = props.showMiddleNameInput!
    const fluid = props.fluid!

    const inputAttributesMap: InputAttributesMap = defaults(props.inputAttributesMap!, {
        prefix: {},
        first: {},
        middle: {},
        last: {}
    })

    const classes = ['person-name-input']
    if (fluid) classes.push('person-name-input-fluid')

    const [childValidChange, fieldValidity] = useFieldValidity()

    const fieldLengths = useContext(ItiReactContext).fieldLengths
    const firstNameValidators = [Validators.maxLength(fieldLengths.personName.first)]
    const lastNameValidators = [Validators.maxLength(fieldLengths.personName.last)]

    if (individualInputsRequired) {
        firstNameValidators.unshift(Validators.required())
        lastNameValidators.unshift(Validators.required())
    }

    const vProps = { showValidation, onValidChange: childValidChange }

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
                    onChange={first => onChange({ ...value, first })}
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
                        onChange={middle => onChange({ ...value, middle })}
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
                    onChange={last => onChange({ ...value, last })}
                    validators={lastNameValidators}
                    showValidation={showValidation}
                    {...vProps}
                />
            </div>
        </ValidationFeedback>
    )
})

_PersonNameInput.defaultProps = {
    showMiddleNameInput: false,
    fluid: false,
    inputAttributesMap: {}
}

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
    return value => ({
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
) {
    const { validators, ...passThroughProps } = props

    return (
        <ValidatedPersonNameInput
            {...passThroughProps}
            validators={[...validators, noPartialNamesValidator]}
        />
    )
}
