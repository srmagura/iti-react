
export function required() {
    return (value: string) => ({
        valid: !!value,
        invalidFeedback: 'This field is required.'
    })
}

export function minLength(minLength: number) {
    return (value: string) => ({
        valid: value.length >= minLength,
        invalidFeedback: `The value must be at least ${minLength} characters.`
    })
}

export function maxLength(maxLength: number) {
    return (value: string) => ({
        valid: value.length <= maxLength,
        invalidFeedback: `The value cannot be longer than ${maxLength} characters.`
    })
}

function isNumber(value: string) {
    // The condition value.length > 0 is because isNaN('') === false. Weird.
    return value.length > 0 && !isNaN(value as any)
}

export function number() {
    return (value: string) => ({
        valid: isNumber(value),
        invalidFeedback: 'You must enter a number.'
    })
}

export function integer() {
    return (value: string) => ({
        valid: isNumber(value) && Number.isInteger(parseFloat(value)),
        invalidFeedback: 'You must enter a whole number.'
    })
}

export function greaterThan(x: number) {
    return (value: string) => ({
        valid: isNumber(value) && parseFloat(value) > x,
        invalidFeedback: `The value must be at least ${x}.`
    })
}

export function lessThan(x: number) {
    return (value: string) => ({
        valid: isNumber(value) && parseFloat(value) < x,
        invalidFeedback: `The value must be less than ${x}.`
    })
}