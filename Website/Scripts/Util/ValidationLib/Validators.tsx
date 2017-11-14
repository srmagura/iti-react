
export function Required() {
    return function(value: string) {
        return {
            valid: !!value,
            invalidFeedback: 'This field is required.'
        };
    }
}

export function MaxLength(maxLength: number) {
    return function (value: string) {
        return {
            valid: value.length <= maxLength,
            invalidFeedback: `The value cannot be longer than ${maxLength} characters.`
        };
    }
}