import { Validator as GenericValidator } from './ValidatorCore'

type Validator = GenericValidator<string>

export function required(): Validator {
    return (value: string) => ({
        valid: !!value,
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

function isNumber(value: string) {
    // The condition value.length > 0 is because isNaN('') === false. Weird.
    return value.length > 0 && !isNaN(value as any)
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
        valid: !value || (isNumber(value) && Number.isInteger(parseFloat(value))),
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
        valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        invalidFeedback: 'You must enter a valid email address.'
    })
}
