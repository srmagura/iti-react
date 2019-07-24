import * as React from 'react'
import { WithValidationProps, Validator, ItiReactContext } from '../..'
import { GetSelectStyles } from '../Select'
import {
    postalCodeValidator,
    PostalCodeValidationOptions
} from '../../Inputs/AddressInput/PostalCodeValidator'
import {
    FieldLengths,
    AddressInputValue,
    AddressInputWithValidation
} from './AddressInputPresentation'

export { AddressInputValue, defaultAddressInputValue } from './AddressInputPresentation'

// internal validator
function disallowPartialAddress(): Validator<AddressInputValue> {
    return (v: AddressInputValue) => {
        const requiredValues = [v.line1, v.city, v.state, v.zip]

        const enteredRequiredValues = requiredValues.filter(v => !!v).length

        return {
            valid:
                enteredRequiredValues === 0 ||
                enteredRequiredValues === requiredValues.length,
            invalidFeedback:
                'Partial addresses are not allowed. ' +
                'Fill out all required fields or leave the address empty.'
        }
    }
}

// internal validator
function allFieldsValid(
    postalCodeValidationOptions: PostalCodeValidationOptions
): Validator<AddressInputValue> {
    return (v: AddressInputValue) => ({
        valid: postalCodeValidator(postalCodeValidationOptions)(v.zip).valid,
        invalidFeedback: ''
    })
}

// internal validator
function allFieldsLengthValidator(
    fieldLengths: FieldLengths
): Validator<AddressInputValue> {
    return (v: AddressInputValue) => ({
        valid:
            v.line1.length <= fieldLengths.line1 &&
            v.line2.length <= fieldLengths.line2 &&
            v.city.length <= fieldLengths.city,
        invalidFeedback: ''
    })
}

export interface AddressInputOwnProps {
    individualInputsRequired?: boolean
    enabled?: boolean

    getStateSelectStyles?: GetSelectStyles
    allowCanadian?: boolean
}

export function AddressInput(
    props: WithValidationProps<AddressInputValue> & AddressInputOwnProps
) {
    return (
        <ItiReactContext.Consumer>
            {data => {
                const fieldLengths = data.fieldLengths.address

                let allowCanadian = props.allowCanadian
                if (typeof allowCanadian === 'undefined')
                    allowCanadian = data.addressInput.allowCanadian

                const validators = [
                    allFieldsValid({ allowCanadian }),
                    allFieldsLengthValidator(fieldLengths),
                    ...props.validators
                ]

                if (!props.individualInputsRequired) {
                    // this validator is only needed for optional addresses
                    validators.push(disallowPartialAddress())
                }

                return (
                    <AddressInputWithValidation
                        {...props}
                        validators={validators}
                        fieldLengths={fieldLengths}
                        allowCanadian={allowCanadian}
                    />
                )
            }}
        </ItiReactContext.Consumer>
    )
}

function required(): Validator<AddressInputValue> {
    return (v: AddressInputValue) => ({
        valid: !!(v.line1 && v.city && v.state && v.zip),
        invalidFeedback: ''
    })
}

export const AddressValidators = {
    required
}
