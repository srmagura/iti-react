﻿export interface FieldValidity {
    [name: string]: boolean
}

export function fieldValidityIsValid(fieldValidity: FieldValidity) {
    return Object.values(fieldValidity).every(v => v)
}

interface FieldValidityState {
    fieldValidity: FieldValidity
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
        x: [(state: FieldValidityState) => FieldValidityState, () => void]
    ) => void,
    callback?: (valid: boolean) => void
) {
    let _fieldValidityIsValid: boolean | undefined

    // May have issues with state updates conflicting if we don't pass a
    // function to setState
    setState([
        (state: FieldValidityState) => {
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