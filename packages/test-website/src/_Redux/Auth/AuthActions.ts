import { UserDto } from 'models'
import { ErrorPayload } from '_Redux/Error'

export const authActions = {
    logInAsync: createAsyncAction('LOG_IN_REQUEST', 'LOG_IN_SUCCESS', 'LOG_IN_FAILURE')<
        {
            email: string
            password: string
            rememberMe: boolean
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
