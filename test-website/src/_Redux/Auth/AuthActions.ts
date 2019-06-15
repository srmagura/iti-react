import { createStandardAction, createAsyncAction } from 'typesafe-actions'
import { UserDto, EmailAddress } from 'Models'

export const authActions = {
    logInAsync: createAsyncAction('LOG_IN_REQUEST', 'LOG_IN_SUCCESS', 'LOG_IN_FAILURE')<
        {
            email: EmailAddress
            password: string
            keepCookieAfterSession: boolean
        },
        undefined,
        any
    >(),
    logOut: createStandardAction('LOG_OUT')(),
    onAuthenticated: createStandardAction('ON_AUTHENTICATED')(),

    meAsync: createAsyncAction('USER_ME_REQUEST', 'USER_ME_SUCCESS', 'USER_ME_FAILURE')<
        undefined,
        UserDto,
        any
    >()
}
