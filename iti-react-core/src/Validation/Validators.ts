﻿import { Validator, ValidatorOutput } from './Validator'

const MAX_SAFE_INT32 = 2 ** 31 - 1
const MIN_SAFE_INT32 = -MAX_SAFE_INT32

function required(): Validator<string> {
    return (value: string): ValidatorOutput => ({
        valid: !!value.trim(),
        invalidFeedback: 'This field is required.',
    })
}

function minLength(minLength: number): Validator<string> {
    return (value: string): ValidatorOutput => ({
        // trim because backend may trim value before checking length
        valid: !value || value.trim().length >= minLength,
        invalidFeedback: `The value must be at least ${minLength} characters.`,
    })
}

function maxLength(maxLength: number): Validator<string> {
    return (value: string): ValidatorOutput => ({
        // don't trim becuase backend may not trim before checking length
        valid: !value || value.length <= maxLength,
        invalidFeedback: `The value cannot be longer than ${maxLength} characters.`,
    })
}

// Don't do: !isNaN(parseFloat(value)) since then isNumber('12b') === true
function isNumber(value: string): boolean {
    // 1st case: has digits to right of decimal (may have digits to the left)
    // 2nd case: has digits to the left of decimal only
    if (/^-?\d*\.\d+$/.test(value) || /^-?\d+\.?$/.test(value)) {
        const n = parseFloat(value)
        return Math.abs(n) <= Number.MAX_VALUE
    }
    return false
}

/** For a required numeric/integer input, you must also pass the required() validator */
function number(): Validator<string> {
    return (value: string): ValidatorOutput => ({
        valid: !value || isNumber(value),
        invalidFeedback: 'You must enter a number.',
    })
}

function isInteger(value: string): boolean {
    if (/^-?\d+$/.test(value)) {
        const n = parseInt(value)
        return n <= MAX_SAFE_INT32 && n >= MIN_SAFE_INT32
    }
    return false
}

function integer(): Validator<string> {
    return (value: string): ValidatorOutput => ({
        valid: !value || isInteger(value),
        invalidFeedback: 'You must enter a whole number.',
    })
}

function greaterThan(x: number): Validator<string> {
    return (value: string): ValidatorOutput => ({
        valid: !value || (isNumber(value) && parseFloat(value) > x),
        invalidFeedback: `The value must be greater than ${x}.`,
    })
}

function greaterThanOrEqual(x: number): Validator<string> {
    return (value: string): ValidatorOutput => ({
        valid: !value || (isNumber(value) && parseFloat(value) >= x),
        invalidFeedback: `The value must be greater than or equal to ${x}.`,
    })
}

function lessThan(x: number): Validator<string> {
    return (value: string): ValidatorOutput => ({
        valid: !value || (isNumber(value) && parseFloat(value) < x),
        invalidFeedback: `The value must be less than ${x}.`,
    })
}

function lessThanOrEqual(x: number): Validator<string> {
    return (value: string): ValidatorOutput => ({
        valid: !value || (isNumber(value) && parseFloat(value) <= x),
        invalidFeedback: `The value must be less than or equal to ${x}.`,
    })
}

// From HTML5 spec - https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

/** Regex-based email validator that uses the regex from the HTML5 spec. */
function email(): Validator<string> {
    return (value: string): ValidatorOutput => ({
        valid: !value || emailRegex.test(value),
        invalidFeedback: 'You must enter a valid email address.',
    })
}

function money(options?: { allowNegative?: boolean }): Validator<string> {
    const allowNegative = options?.allowNegative ?? false

    return (value: string): ValidatorOutput => {
        value = value.trim()

        const _isNumber = isNumber(value)
        const hasAtMost2DecimalPlaces = /^-?\d*\.?\d{0,2}$/.test(value)
        const signIsAllowed = allowNegative || parseFloat(value) >= 0

        let invalidFeedback =
            'You must enter a valid dollar amount. Do not type the $ sign.'

        if (_isNumber && !signIsAllowed)
            invalidFeedback = 'Negative amounts are not allowed.'

        return {
            valid: !value || (_isNumber && hasAtMost2DecimalPlaces && signIsAllowed),
            invalidFeedback,
        }
    }
}

/**
 * Validators for `string` values. Each property on this object is a function that returns
 * a `Validator<string>`.
 *
 * ```
 * const validators = [Validators.required(), Validators.integer(), Validators.greaterThan(0)]
 * ```
 */
export const Validators = {
    required,
    minLength,
    maxLength,
    number,
    integer,
    greaterThan,
    greaterThanOrEqual,
    lessThan,
    lessThanOrEqual,
    email,
    money,
}
