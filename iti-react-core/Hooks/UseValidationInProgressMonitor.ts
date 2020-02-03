import { FieldValidity, useFieldValidityInternal } from './UseFieldValidity'

export type ValidationProgress = FieldValidity

export function areAnyInProgress(asyncProgress: ValidationProgress) {
    return Object.values(asyncProgress).some(v => v)
}

// Keep tracks of which async validators are in progress.
// Comparable to useFieldValidity.
//
// Basic usage:
//
//     const [onChildProgressChange] = useValidationInProgressMonitor()
//
export function useValidationInProgressMonitor(options?: {
    onInProgressChange?: (inProgress: boolean) => void
    defaultValue?: ValidationProgress
}): [(fieldName: string, inProgress: boolean) => void, FieldValidity] {
    return useFieldValidityInternal({
        ...options,
        fieldValidityIsValid: areAnyInProgress
    })
}
