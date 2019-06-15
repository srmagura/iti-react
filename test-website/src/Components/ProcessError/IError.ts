import { ErrorType } from "./ErrorType";

// "I" to avoid conflict with built-in Error type
export interface IError {
    message: string
    type: ErrorType
    diagnosticInfo?: string
}
