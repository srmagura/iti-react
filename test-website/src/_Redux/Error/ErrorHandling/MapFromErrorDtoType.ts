import {ErrorDtoType} from 'Models'
import { ErrorType } from './ErrorType'

export function mapFromErrorDtoType(errorDtoType: ErrorDtoType) {
    switch (errorDtoType) {
        case ErrorDtoType.InternalServerError:
            return ErrorType.InternalServerError
        case ErrorDtoType.BadRequest:
            return ErrorType.BadRequest
        case ErrorDtoType.NotAuthorized:
            return ErrorType.NotAuthorized
        case ErrorDtoType.UserDoesNotExist:
            return ErrorType.UserDoesNotExist
    }

    return ErrorType.UnknownError
}