import { FieldValidity, useFieldValidityInternal } from './UseFieldValidity'

export type ValidationProgress = FieldValidity

export function areAnyInProgress(validationProgress: ValidationProgress): boolean {
    return Object.values(validationProgress).some((v) => v)
}

// Keep tracks of which async validators are in progress.
// Comparable to useFieldValidity.
//
// Basic usage:
//
//     const [onChildProgressChange, validationProgress] = useValidationInProgressMonitor()
//
export function useValidationInProgressMonitor(options?: {
    onValidationInProgressChange?: (inProgress: boolean) => void
    defaultValue?: ValidationProgress
}): [(fieldName: string, inProgress: boolean) => void, FieldValidity] {
    return useFieldValidityInternal({
        onValidChange: options?.onValidationInProgressChange,
        defaultValue: options?.defaultValue,
        fieldValidityIsValid: areAnyInProgress,
    })
}
