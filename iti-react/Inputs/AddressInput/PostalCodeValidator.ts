﻿import { Validator } from '../../Validation'

export interface PostalCodeValidationOptions {
    allowCanadian: boolean
}

export const defaultPostalCodeValidationOptions: PostalCodeValidationOptions = {
    allowCanadian: true
}

export function isPostalCodeValid(
    code: string,
    options: PostalCodeValidationOptions = defaultPostalCodeValidationOptions
): boolean {
    code = code.replace('-', '').replace(' ', '')

    if (code.length === 5 || code.length === 9) {
        // US zip codes - valid if digits only
        return /^\d*$/.test(code)
    } else if (code.length === 6 && options.allowCanadian) {
        // Canadian postal codes, e.g. A1A 1A1
        return /^(?:[a-z]\d){3}$/i.test(code)
    }

    return false
}

export function postalCodeValidator(
    options: PostalCodeValidationOptions = defaultPostalCodeValidationOptions
): Validator<string> {
    return value => ({
        valid: !value || isPostalCodeValid(value, options),
        invalidFeedback: `Invalid ${options.allowCanadian ? 'postal' : 'zip'} code.`
    })
}
