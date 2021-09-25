import {
    ValidatorOutput,
    Validator,
    INVALID_NO_FEEDBACK,
} from '@interface-technologies/iti-react-core'
import { postalCodeValidator, PostalCodeValidationOptions } from './PostalCodeValidator'
import { AddressInputValue } from './AddressInputValue'
import { AddressInputFieldLengths } from './AddressInputFieldLengths'

/**
 * Only use this if making your own address input.
 */
export function disallowPartialAddress(): Validator<AddressInputValue> {
    return (v: AddressInputValue): ValidatorOutput => {
        const requiredValues = [v.line1, v.city, v.state, v.postalCode]

        const enteredRequiredValues = requiredValues.filter((v) => !!v).length

        if (
            enteredRequiredValues !== 0 &&
            enteredRequiredValues !== requiredValues.length
        ) {
            return (
                'Partial addresses are not allowed. ' +
                'Fill out all required fields or leave the address empty.'
            )
        }

        return undefined
    }
}

/**
 * Only use this if making your own address input.
 */
export function allAddressFieldsValid(
    postalCodeValidationOptions: PostalCodeValidationOptions
): Validator<AddressInputValue> {
    return (value) => {
        // postalCode is the only field that has validation logic
        if (postalCodeValidator(postalCodeValidationOptions)(value.postalCode))
            return INVALID_NO_FEEDBACK

        return undefined
    }
}

/**
 * Only use this if making your own address input.
 */
export function allAddressFieldLengthsValid(
    fieldLengths: AddressInputFieldLengths
): Validator<AddressInputValue> {
    return (value) => {
        if (
            value.line1.length > fieldLengths.line1 ||
            value.line2.length > fieldLengths.line2 ||
            value.city.length > fieldLengths.city
        ) {
            return INVALID_NO_FEEDBACK
        }

        return undefined
    }
}

function required(): Validator<AddressInputValue> {
    return (value) => {
        if (!(value.line1 && value.city && value.state && value.postalCode)) {
            // "This field is required." will be displayed under individual inputs
            return INVALID_NO_FEEDBACK
        }

        return undefined
    }
}

/** Validators for use with [[`AddressInput`]]. */
export const AddressValidators = {
    required,
}

/** Validators you can use to build your own custom address input. */
export const InternalAddressValidators = {
    disallowPartialAddress,
    allAddressFieldsValid,
    allAddressFieldLengthsValid,
}
