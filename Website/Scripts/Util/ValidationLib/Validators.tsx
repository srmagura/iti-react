
export function Required() {
    return (value: string) => ({
        valid: !!value,
        invalidFeedback: 'This field is required.'
    })
}

export function MinLength(minLength: number) {
    return (value: string) => ({
        valid: value.length >= minLength,
        invalidFeedback: `The value must be at least ${minLength} characters.`
    })
}

export function MaxLength(maxLength: number) {
    return (value: string) => ({
        valid: value.length <= maxLength,
        invalidFeedback: `The value cannot be longer than ${maxLength} characters.`
    })
}

export function Number() {
    return (value: string) => ({
        // value.length > 0 because isNaN('') === false. Weird.
        valid: value.length > 0 && !isNaN(value as any),
        invalidFeedback: 'You must enter a number.'
    })
}