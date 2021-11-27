import { ErrorDtoType } from 'models'
import { ErrorType } from './ErrorType'

export function mapFromErrorDtoType(errorDtoType: ErrorDtoType) {
    switch (errorDtoType) {
        case ErrorDtoType.InternalServerError:
            return ErrorType.InternalServerError
        case ErrorDtoType.InvalidLogin:
            return ErrorType.InvalidLogin
        case ErrorDtoType.NotAuthorized:
            return ErrorType.NotAuthorized
        case ErrorDtoType.UserDoesNotExist:
            return ErrorType.UserDoesNotExist
    }

    return ErrorType.UnknownError
}
