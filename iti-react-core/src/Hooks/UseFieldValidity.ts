﻿import { noop } from 'lodash'
import { useState, useEffect, useCallback, useRef } from 'react'
import produce from 'immer'

/** Tells us which form fields are valid. */
export interface FieldValidity {
    [name: string]: boolean
}

/**
 * @returns true if all entries in the `FieldValidity` object are valid, false otherwise
 */
export function fieldValidityIsValid(fieldValidity: FieldValidity): boolean {
    return Object.values(fieldValidity).every((v) => v)
}

/**
 * @internal
 *
 * Lets you pass in whatever `fieldValidityIsValid` function you want.
 */
export function useFieldValidityInternal({
    onValidChange = noop,
    defaultValue = {},
    fieldValidityIsValid,
}: {
    onValidChange: ((valid: boolean) => void) | undefined
    defaultValue: FieldValidity | undefined
    fieldValidityIsValid: (fieldValidity: FieldValidity) => boolean
}): [(fieldName: string, valid: boolean) => void, FieldValidity] {
    const [fieldValidity, setFieldValidity] = useState<FieldValidity>(defaultValue)

    const onValidChangeRef = useRef(onValidChange)
    useEffect(() => {
        onValidChangeRef.current = onValidChange
    })

    const fvIsValid = fieldValidityIsValid(fieldValidity)
    useEffect(() => {
        onValidChangeRef.current(fvIsValid)
    }, [fvIsValid])

    const onChildValidChange = useCallback((fieldName: string, valid: boolean): void => {
        setFieldValidity(
            produce((draft: FieldValidity) => {
                draft[fieldName] = valid
            })
        )
    }, [])

    return [onChildValidChange, fieldValidity]
}

/**
 * Keep tracks of a `FieldValidity` and returns a function to update the
 * the `FieldValidty`.
 *
 * You don't need to use this if there is only one validated input. In that case,
 * a simple `const [valid, setValid] = useState(false)` is sufficient.
 *
 * Top-level usage (e.g. when using `EasyFormDialog`):
 * ```
 * const [onChildValidChange, fieldValidity] = useFieldValidity()
 * ```
 *
 * Usage with `onValidChange` from props:
 * ```
 * const [onChildValidChange] = useFieldValidity({ onValidChange })
 * ```
 */
export function useFieldValidity(options?: {
    onValidChange?: (valid: boolean) => void
    defaultValue?: FieldValidity
}): [(fieldName: string, valid: boolean) => void, FieldValidity] {
    return useFieldValidityInternal({
        onValidChange: options?.onValidChange,
        defaultValue: options?.defaultValue,
        fieldValidityIsValid,
    })
}
