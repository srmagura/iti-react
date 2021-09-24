import { FieldValidity, useFieldValidityCore } from './UseFieldValidity'

/**
 * Keeps track of which async validators are in progress. An alias for [[`FieldValidity`]].
 */
export type ValidationProgress = FieldValidity

/**
 * @returns true if any async validators are in progress.
 */
function areAnyInProgress(validationProgress: ValidationProgress): boolean {
    return Object.values(validationProgress).some((v) => v)
}

/**
 * Keep tracks of which async validators are in progress. Comparable to useFieldValidity.
 *
 * ```
 * const {onChildProgressChange, anyValidationInProgress, validationProgress} = useValidationInProgressMonitor()
 * ```
 */
export function useValidationInProgressMonitor(options?: {
    onValidationInProgressChange?: (inProgress: boolean) => void
    defaultValue?: ValidationProgress
}): {
    onChildProgressChange: (fieldName: string, inProgress: boolean) => void
    anyValidationInProgress: boolean
    validationProgress: ValidationProgress
} {
    const x = useFieldValidityCore({
        onValidChange: options?.onValidationInProgressChange,
        defaultValue: options?.defaultValue,
        fieldValidityIsValid: areAnyInProgress,
    })

    return {
        onChildProgressChange: x.onChildValidChange,
        anyValidationInProgress: x.allFieldsValid,
        validationProgress: x.fieldValidity,
    }
}
