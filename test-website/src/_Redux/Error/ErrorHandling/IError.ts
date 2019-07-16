import { ErrorType } from './ErrorType'

// "I" to avoid conflict with built-in Error type
export interface IError {
    readonly type: ErrorType
    readonly message: string
    readonly diagnosticInfo?: string

    handled: boolean
}

// Doesn't "do" anything, just for type-checking, code readability,
// and defaulting handled to false
export function createIError(e: {
    type: ErrorType
    message: string
    diagnosticInfo?: string
    handled?: boolean
}): IError {
    return {
        ...e,
        handled: typeof e.handled !== 'undefined' ? e.handled : false
    }
}

export function isIError(obj: any): boolean {
    return (
        obj &&
        obj.hasOwnProperty('message') &&
        obj.hasOwnProperty('type') &&
        obj.hasOwnProperty('handled') &&
        !obj.hasOwnProperty('typeName')
    )
}
