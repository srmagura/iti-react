import { ErrorType } from "./ErrorType";

// "I" to avoid conflict with built-in Error type
export interface IError {
    readonly type: ErrorType
    readonly message: string
    readonly diagnosticInfo?: string

    handled: boolean
}

// Doesn't "do" anything, just for type-checking and code readability
export function createIError(e: IError): IError {
    return e
}
