import { noop } from 'lodash'
import { useState, useEffect } from 'react'
import produce from 'immer'

// Tells us which form fields are valid
export interface FieldValidity {
    [name: string]: boolean
}

export function fieldValidityIsValid(fieldValidity: FieldValidity): boolean {
    return Object.values(fieldValidity).every(v => v)
}

// Lets you pass in whatever "fieldValidityIsValid" function you want
export function useFieldValidityInternal({
    onValidChange = noop,
    defaultValue = {},
    fieldValidityIsValid
}: {
    onValidChange: ((valid: boolean) => void) | undefined
    defaultValue: FieldValidity | undefined
    fieldValidityIsValid: (fieldValidity: FieldValidity) => boolean
}): [(fieldName: string, valid: boolean) => void, FieldValidity] {
    const [fieldValidity, setFieldValidity] = useState<FieldValidity>(defaultValue)

    const fvIsValid = fieldValidityIsValid(fieldValidity)
    useEffect(() => {
        onValidChange(fvIsValid)
    }, [onValidChange, fvIsValid])

    function onChildValidChange(fieldName: string, valid: boolean): void {
        setFieldValidity(
            produce((draft: FieldValidity) => {
                draft[fieldName] = valid
            })
        )
    }

    return [onChildValidChange, fieldValidity]
}

// Keep tracks of a FieldValidity and returns a function to update the
// the FieldValidty.
//
// Basic usage:
//
//     const [onChildValidChange] = useFieldValidity()
//
export function useFieldValidity(options?: {
    onValidChange?: (valid: boolean) => void
    defaultValue?: FieldValidity
}): [(fieldName: string, valid: boolean) => void, FieldValidity] {
    return useFieldValidityInternal({
        onValidChange: options?.onValidChange,
        defaultValue: options?.defaultValue,
        fieldValidityIsValid
    })
}
