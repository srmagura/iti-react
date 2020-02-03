﻿import { defaults } from 'lodash'
import { useState, useEffect } from 'react'
import produce from 'immer'

// Tells us which form fields are valid
export interface FieldValidity {
    [name: string]: boolean
}

export function fieldValidityIsValid(fieldValidity: FieldValidity) {
    return Object.values(fieldValidity).every(v => v)
}

// Lets you pass in whatever "fieldValidityIsValid" function you want
export function useFieldValidityInternal(options: {
    onValidChange?: (valid: boolean) => void
    defaultValue?: FieldValidity
    fieldValidityIsValid: (fieldValidity: FieldValidity) => boolean
}): [(fieldName: string, valid: boolean) => void, FieldValidity] {
    const { onValidChange, defaultValue, fieldValidityIsValid } = defaults(
        { ...options },
        {
            onValidChange: () => {},
            defaultValue: {}
        }
    )

    const [fieldValidity, setFieldValidity] = useState<FieldValidity>(defaultValue)

    useEffect(() => {
        onValidChange(fieldValidityIsValid(fieldValidity))
    }, [fieldValidity])

    function onChildValidChange(fieldName: string, valid: boolean) {
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
    return useFieldValidityInternal({ ...options, fieldValidityIsValid })
}
