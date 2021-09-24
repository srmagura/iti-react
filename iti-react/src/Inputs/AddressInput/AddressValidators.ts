import { ValidatorOutput, Validator } from '@interface-technologies/iti-react-core'
import { postalCodeValidator, PostalCodeValidationOptions } from './PostalCodeValidator'
import { AddressInputValue } from './AddressInputValue'
import { AddressInputFieldLengths } from './AddressInputFieldLengths'

/** @internal */
export function disallowPartialAddress(): Validator<AddressInputValue> {
    return (v: AddressInputValue): ValidatorOutput => {
        const requiredValues = [v.line1, v.city, v.state, v.postalCode]

        const enteredRequiredValues = requiredValues.filter((v) => !!v).length

        return {
            valid:
                enteredRequiredValues === 0 ||
                enteredRequiredValues === requiredValues.length,
            invalidFeedback:
                'Partial addresses are not allowed. ' +
                'Fill out all required fields or leave the address empty.',
        }
    }
}

/** @internal */
export function allFieldsValid(
    postalCodeValidationOptions: PostalCodeValidationOptions
): Validator<AddressInputValue> {
    return (value) =>
        // postalCode is the only field that has validation logic
        postalCodeValidator(postalCodeValidationOptions)(value.postalCode)
}

/** @internal */
export function allFieldLengthsValid(
    fieldLengths: AddressInputFieldLengths
): Validator<AddressInputValue> {
    return (v: AddressInputValue): ValidatorOutput => ({
        valid:
            v.line1.length <= fieldLengths.line1 &&
            v.line2.length <= fieldLengths.line2 &&
            v.city.length <= fieldLengths.city,
        invalidFeedback: '',
    })
}

function required(): Validator<AddressInputValue> {
    return (v: AddressInputValue): ValidatorOutput => ({
        valid: !!(v.line1 && v.city && v.state && v.postalCode),
        invalidFeedback: '',
    })
}

/** Validators for use with [[`AddressInput`]]. */
export const AddressValidators = {
    required,
}

/** @internal */
export const InternalAddressValidators = {
    disallowPartialAddress,
    allFieldsValid,
    allFieldLengthsValid,
}
