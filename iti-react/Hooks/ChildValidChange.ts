﻿import {
    FieldValidity,
    fieldValidityIsValid
} from '@interface-technologies/iti-react-core'

interface FieldValidityState {
    fieldValidity: FieldValidity
}

// FOR CLASS COMPONENTS - to be removed eventually
//
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