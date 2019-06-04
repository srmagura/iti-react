import { Validator as GenericValidator } from './ValidatorCore'

type Validator = GenericValidator<string>

export function required(): Validator {
    return (value: string) => ({
        valid: !!value.trim(),
        invalidFeedback: 'This field is required.'
    })
}

export function minLength(minLength: number): Validator {
    return (value: string) => ({
        valid: !value || value.length >= minLength,
        invalidFeedback: `The value must be at least ${minLength} characters.`
    })
}

export function maxLength(maxLength: number): Validator {
    return (value: string) => ({
        valid: !value || value.length <= maxLength,
        invalidFeedback: `The value cannot be longer than ${maxLength} characters.`
    })
}

// Don't do: !isNaN(parseFloat(value)) since then isNumber('12b') === true
function isNumber(value: string) {
    return /^-?\d+\.\d+$/.test(value) || /^-?\d+\.?$/.test(value)
}

// for a required numeric/integer input, you must also pass the required() validator
export function number(): Validator {
    return (value: string) => ({
        valid: !value || isNumber(value),
        invalidFeedback: 'You must enter a number.'
    })
}

export function integer(): Validator {
    return (value: string) => ({
        valid: !value || /^-?\d+$/.test(value),
        invalidFeedback: 'You must enter a whole number.'
    })
}

export function greaterThan(x: number): Validator {
    return (value: string) => ({
        valid: !value || (isNumber(value) && parseFloat(value) > x),
        invalidFeedback: `The value must be greater than ${x}.`
    })
}

export function greaterThanOrEqual(x: number): Validator {
    return (value: string) => ({
        valid: !value || (isNumber(value) && parseFloat(value) >= x),
        invalidFeedback: `The value must be greater than or equal to ${x}.`
    })
}

export function lessThan(x: number): Validator {
    return (value: string) => ({
        valid: !value || (isNumber(value) && parseFloat(value) < x),
        invalidFeedback: `The value must be less than ${x}.`
    })
}

export function lessThanOrEqual(x: number): Validator {
    return (value: string) => ({
        valid: !value || (isNumber(value) && parseFloat(value) <= x),
        invalidFeedback: `The value must be less than or equal to ${x}.`
    })
}

export function email(): Validator {
    return (value: string) => ({
        valid: !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        invalidFeedback: 'You must enter a valid email address.'
    })
}

export function money(): Validator {
    return (value: string) => ({
        // Regex has two cases: 1+ dollar like 13.49, or cents-only like 0.35
        valid: !value || (/^(\d+(.\d\d)?|.\d\d)$/.test(value) && parseFloat(value) >= 0),
        invalidFeedback: 'You must enter a valid dollar amount. Do not type the $ sign.'
    })
}
