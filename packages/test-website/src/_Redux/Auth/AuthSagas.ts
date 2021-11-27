import moment from 'moment-timezone'
import { put, call, takeEvery } from 'redux-saga/effects'
import { api } from 'api'
import { UserLogInDto, UserDto } from 'models'
import Cookies, { CookieAttributes } from 'js-cookie'
import { accessTokenCookieName } from 'Components/Constants'
import { ErrorType, processError } from '_Redux/Error/ErrorHandling'
import { isAuthenticated } from 'api/ApiUtil'
import { defer } from 'lodash'
import { authActions } from './AuthActions'

export function* authSaga() {
    yield takeEvery(authActions.logInAsync.request, logIn)
    yield takeEvery(authActions.meAsync.request, userMe)
    yield takeEvery(authActions.logOut, logOut)

    if (isAuthenticated()) {
        yield put(authActions.meAsync.request())
    }
}

export function* logIn(action: ReturnType<typeof authActions.logInAsync.request>) {
    const { email, password, keepCookieAfterSessionEnds } = action.payload

    try {
        const { accessToken, expiresUtc }: UserLogInDto = yield call(api.user.login, {
            email,
            password,
        })

        const cookieAttr: CookieAttributes = {
            secure: !(window as any).isDebug,
        }

        // if cookieAttr.expires is not set, cookie will expire when browser is closed
        if (keepCookieAfterSessionEnds)
            cookieAttr.expires = moment.utc(expiresUtc).local().toDate()

        Cookies.set(accessTokenCookieName, accessToken, cookieAttr)

        yield put(authActions.logInAsync.success())

        yield put(authActions.meAsync.request())
    } catch (e) {
        const ierror = processError(e)

        if (ierror.type === ErrorType.InvalidLogin) {
            ierror.handled = true
        }

        yield put(authActions.logInAsync.failure({ error: ierror }))
    }
}

export function* userMe() {
    try {
        const user: UserDto = yield call(api.user.me)

        if (!user) {
            // should never happen
            throw new Error('User is null.')
        }

        yield put(authActions.meAsync.success(user))
        yield put(authActions.onAuthenticated())
    } catch (e) {
        const ierror = processError(e)

        if (ierror.type === ErrorType.UserDoesNotExist) {
            // Resetting users in the DB means your cookie now has an ID for a user that
            // no longer exists. When this happens, delete the cookie.
            // The user will get redirected to the login page.
            Cookies.remove(accessTokenCookieName)
            ierror.handled = true
        } else if ((e as { status: number }).status === 401) {
            // 401 means token is invalid, e.g. it has past its expiration.
            // don't need to show an error in this case
            ierror.handled = true
        }

        yield put(authActions.meAsync.failure({ error: e }))
    }
}

function logOut(): void {
    Cookies.remove(accessTokenCookieName)
}
