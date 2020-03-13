﻿import { Validator, ValidatorOutput } from './Validator'

export function required(): Validator<string> {
    return (value: string): ValidatorOutput => ({
        valid: !!value.trim(),
        invalidFeedback: 'This field is required.'
    })
}

export function minLength(minLength: number): Validator<string> {
    return (value: string): ValidatorOutput => ({
        valid: !value || value.length >= minLength,
        invalidFeedback: `The value must be at least ${minLength} characters.`
    })
}

export function maxLength(maxLength: number): Validator<string> {
    return (value: string): ValidatorOutput => ({
        valid: !value || value.length <= maxLength,
        invalidFeedback: `The value cannot be longer than ${maxLength} characters.`
    })
}

// Don't do: !isNaN(parseFloat(value)) since then isNumber('12b') === true
function isNumber(value: string): boolean {
    // 1st case: has digits to right of decimal (may have digits to the left)
    // 2nd case: has digits to the left of decimal only
    return /^-?\d*\.\d+$/.test(value) || /^-?\d+\.?$/.test(value)
}

// for a required numeric/integer input, you must also pass the required() validator
export function number(): Validator<string> {
    return (value: string): ValidatorOutput => ({
        valid: !value || isNumber(value),
        invalidFeedback: 'You must enter a number.'
    })
}

export function integer(): Validator<string> {
    return (value: string): ValidatorOutput => ({
        valid: !value || /^-?\d+$/.test(value),
        invalidFeedback: 'You must enter a whole number.'
    })
}

export function greaterThan(x: number): Validator<string> {
    return (value: string): ValidatorOutput => ({
        valid: !value || (isNumber(value) && parseFloat(value) > x),
        invalidFeedback: `The value must be greater than ${x}.`
    })
}

export function greaterThanOrEqual(x: number): Validator<string> {
    return (value: string): ValidatorOutput => ({
        valid: !value || (isNumber(value) && parseFloat(value) >= x),
        invalidFeedback: `The value must be greater than or equal to ${x}.`
    })
}

export function lessThan(x: number): Validator<string> {
    return (value: string): ValidatorOutput => ({
        valid: !value || (isNumber(value) && parseFloat(value) < x),
        invalidFeedback: `The value must be less than ${x}.`
    })
}

export function lessThanOrEqual(x: number): Validator<string> {
    return (value: string): ValidatorOutput => ({
        valid: !value || (isNumber(value) && parseFloat(value) <= x),
        invalidFeedback: `The value must be less than or equal to ${x}.`
    })
}

export function email(): Validator<string> {
    return (value: string): ValidatorOutput => ({
        valid: !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        invalidFeedback: 'You must enter a valid email address.'
    })
}

interface MoneyOptions {
    allowNegative: boolean
}

export function money(
    options: MoneyOptions = { allowNegative: false }
): Validator<string> {
    return (value: string): ValidatorOutput => {
        value = value.trim()

        const _isNumber = isNumber(value)
        const hasAtMost2DecimalPlaces = /^-?\d*\.?\d{0,2}$/.test(value)
        const signIsAllowed = options.allowNegative || parseFloat(value) >= 0

        let invalidFeedback =
            'You must enter a valid dollar amount. Do not type the $ sign.'

        if (_isNumber && !signIsAllowed)
            invalidFeedback = 'Negative amounts are not allowed.'

        return {
            valid: !value || (_isNumber && hasAtMost2DecimalPlaces && signIsAllowed),
            invalidFeedback
        }
    }
}