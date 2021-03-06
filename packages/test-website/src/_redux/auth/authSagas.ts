import { put, takeEvery, call } from 'redux-saga/effects'
import moment from 'moment-timezone'
import { api } from 'api'
import { UserLogInDto } from 'models'
import Cookies, { CookieAttributes } from 'js-cookie'
import { accessTokenCookieName } from '_constants'
import { ErrorType, processError } from '_util/errorHandling'
import { SagaIterator } from 'redux-saga'
import { isAuthenticated, queryClient } from 'api/util'
import { authActions } from './authSlice'

export function* authSaga(): SagaIterator<void> {
    yield takeEvery(authActions.logInAsync.request, logIn)
    yield takeEvery(authActions.logOut, logOut)

    if (isAuthenticated()) {
        yield put(authActions.hasSavedAccessToken())
    }

    yield put(authActions.authBootstrapped())
}

export function* logIn(
    action: ReturnType<typeof authActions.logInAsync.request>
): SagaIterator<void> {
    const { email, password, rememberMe } = action.payload

    try {
        const { accessToken, expiresUtc }: UserLogInDto = yield call(api.user.logIn, {
            email,
            password,
        })

        const cookieAttributes: CookieAttributes = {
            secure: window.location.protocol.toLowerCase() === 'https:',
            sameSite: 'Lax',
            expires: rememberMe ? moment(expiresUtc).toDate() : undefined,
        }

        Cookies.set(accessTokenCookieName, accessToken, cookieAttributes)

        yield put(authActions.logInAsync.fulfilled())
    } catch (e) {
        const ierror = processError(e)

        if (ierror.type === ErrorType.BadRequest) ierror.handled = true

        yield put(authActions.logInAsync.rejected({ error: ierror }))
    }
}

function logOut(): void {
    Cookies.remove(accessTokenCookieName)
    queryClient.clear()
}
