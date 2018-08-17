export interface IFieldValidity {
    [name: string]: boolean
}

export function fieldValidityIsValid(fieldValidity: IFieldValidity) {
    return Object.values(fieldValidity).every(v => v)
}

interface IFieldValidityState {
    fieldValidity: IFieldValidity
}

// The caller should pass
//
//     f => this.setState(f)
//
// for the setState argument so that the 'this' context is correct.
export function childValidChange(
    fieldName: string,
    valid: boolean,
    setState: (f: (state: IFieldValidityState) => IFieldValidityState) => void,
    onValidChange?: (valid: boolean) => void
) {
    // May have issues with state updates conflicting if we don't pass a
    // function to setState
    setState((state: IFieldValidityState) => {
        const fieldValidity = {
            ...state.fieldValidity,
            [fieldName]: valid
        }

        if (onValidChange) onValidChange(fieldValidityIsValid(fieldValidity))

        return { ...state, fieldValidity }
    })
}
