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
//     x => this.setState(...x)
//
// for the setState argument.
export function childValidChange(
    fieldName: string,
    valid: boolean,
    setState: (
        x: [(state: IFieldValidityState) => IFieldValidityState, () => void]
    ) => void,
    callback?: (valid: boolean) => void
) {
    let _fieldValidityIsValid: boolean | undefined

    // May have issues with state updates conflicting if we don't pass a
    // function to setState
    setState([
        (state: IFieldValidityState) => {
            const fieldValidity = {
                ...state.fieldValidity,
                [fieldName]: valid
            }

            _fieldValidityIsValid = fieldValidityIsValid(fieldValidity)

            return { ...state, fieldValidity }
        },
        () => {
            if (callback) {
                if (typeof _fieldValidityIsValid === 'undefined')
                    throw new Error('_fieldValidityIsValid was undefined.')

                callback(_fieldValidityIsValid)
            }
        }
    ])
}
