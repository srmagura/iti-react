export interface IFieldValidity {
    [name: string]: boolean;
}

export function fieldValidityIsValid(fieldValidity: IFieldValidity) {
    for (const name in fieldValidity) {
        if (fieldValidity.hasOwnProperty(name)) {
            if (!fieldValidity[name])
                return false;
        }
    }

    return true;
}

interface IFieldValidityState {
    fieldValidity: IFieldValidity;
}

// The caller should pass
//
//     f => this.setState(f)
//
// for the setState argument so that the 'this' context is correct.
export function childValidChange(fieldName: string, valid: boolean,
    setState: (f: (state: IFieldValidityState) => IFieldValidityState) => void,
    onValidChange?: (valid: boolean) => void) {
    // May have issues with state updates conflicting if we don't pass a
    // function to seIState
    setState((state: IFieldValidityState) => {
        const fieldValidity =
        {
            ...state.fieldValidity,
            [fieldName]: valid
        };

        if (onValidChange)
            onValidChange(fieldValidityIsValid(fieldValidity));

        return { ...state, fieldValidity };
    });
}