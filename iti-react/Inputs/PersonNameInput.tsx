import * as React from 'react'
import { useContext } from 'react'
import {
    ValidatedInput,
    Validators,
    useFieldValidity,
    ValidatorOutput,
    WithValidationInjectedProps,
    withValidation
} from '@interface-technologies/iti-react'
import { ItiReactContext } from '../../iti-react/ItiReactContext'

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

interface PersonNameInputOwnProps {
    id?: string
    enabled?: boolean
    formLevelValidatorOutput?: ValidatorOutput

    showMiddleNameInput?: boolean
    fluid?: boolean
    individualInputsRequired: boolean
}

type PersonNameInputProps = PersonNameInputOwnProps &
    WithValidationInjectedProps<PersonNameInputValue>

const _PersonNameInput: React.SFC<PersonNameInputProps> = React.memo<
    PersonNameInputProps
>(props => {
    const { value, onChange, name, showValidation, individualInputsRequired } = props
    const showMiddleNameInput = props.showMiddleNameInput!
    const fluid = props.fluid!

    const classes = ['person-name-input']
    if (fluid) classes.push('person-name-input-fluid')

    const fieldLengths = useContext(ItiReactContext).fieldLengths
    const firstNameValidators = [Validators.maxLength(fieldLengths.personName.first)]
    const lastNameValidators = [Validators.maxLength(fieldLengths.personName.last)]

    if (individualInputsRequired) {
        firstNameValidators.unshift(Validators.required())
        lastNameValidators.unshift(Validators.required())
    }

    return (
        <div className={classes.join(' ')}>
            <ValidatedInput
                name={name + 'First'}
                inputAttributes={{
                    placeholder: 'First'
                }}
                value={value.first}
                onChange={first => onChange({ ...value, first })}
                validators={firstNameValidators}
                showValidation={showValidation}
            />
            {showMiddleNameInput && (
                <ValidatedInput
                    name={name + 'Middle'}
                    inputAttributes={{ placeholder: 'Middle' }}
                    value={value.middle}
                    onChange={middle => onChange({ ...value, middle })}
                    // Never required because some people don't have middle names
                    validators={[Validators.maxLength(fieldLengths.personName.middle)]}
                    showValidation={showValidation}
                />
            )}
            <ValidatedInput
                name={name + 'Last'}
                inputAttributes={{
                    placeholder: 'Last'
                }}
                value={value.last}
                onChange={last => onChange({ ...value, last })}
                validators={lastNameValidators}
                showValidation={showValidation}
            />
        </div>
    )
})

_PersonNameInput.defaultProps = { showMiddleNameInput: false, fluid: false }

export const PersonNameInput = withValidation<
    PersonNameInputOwnProps,
    PersonNameInputValue
>({
    defaultValue: defaultPersonNameInputValue
})(_PersonNameInput)
