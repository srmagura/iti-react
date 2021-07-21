import { createAction, createAsyncAction } from 'typesafe-actions'
import { UserDto, EmailAddressDto } from 'Models'
import { ErrorPayload } from '_Redux/Error'

export const authActions = {
    logInAsync: createAsyncAction('LOG_IN_REQUEST', 'LOG_IN_SUCCESS', 'LOG_IN_FAILURE')<
        {
            email: EmailAddressDto
            password: string
            keepCookieAfterSessionEnds: boolean
        },
        undefined,
        ErrorPayload
    >(),
    logOut: createAction('LOG_OUT')(),
    onAuthenticated: createAction('ON_AUTHENTICATED')(),

    meAsync: createAsyncAction('USER_ME_REQUEST', 'USER_ME_SUCCESS', 'USER_ME_FAILURE')<
        undefined,
        UserDto,
        ErrorPayload
    >(),
}
