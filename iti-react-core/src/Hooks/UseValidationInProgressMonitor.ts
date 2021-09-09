import { FieldValidity, useFieldValidityInternal } from './UseFieldValidity'

/**
 * Keeps track of which async validators are in progress.
 *
 * @category Hooks
 */
export type ValidationProgress = FieldValidity

/**
 * @returns true if any async validators are in progress.
 *
 * @category Hooks
 */
export function areAnyInProgress(validationProgress: ValidationProgress): boolean {
    return Object.values(validationProgress).some((v) => v)
}

/**
 * Keep tracks of which async validators are in progress. Comparable to useFieldValidity.
 *
 * ```
 * const [onChildProgressChange, validationProgress] = useValidationInProgressMonitor()
 * ```
 *
 * @category Hooks
 */
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
