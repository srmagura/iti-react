import * as moment from 'moment-timezone'
import { put, call, takeEvery } from 'redux-saga/effects'
import { api } from 'Api'
import { UserLogInDto, UserDto } from 'Models'
import { authActions } from './AuthActions'
import * as Cookies from 'js-cookie'
import { CookieAttributes } from 'js-cookie';
import { accessTokenCookieName } from 'Components/Constants';

export function* authSaga() {
    yield takeEvery(authActions.logInAsync.request, logIn)
    yield takeEvery(authActions.onAuthenticated, onAuthenticated)
    yield takeEvery(authActions.meAsync.request, userMe)
}

export function* logIn(action: ReturnType<typeof authActions.logInAsync.request>) {
    const { email, password, keepCookieAfterSession } = action.payload

    try {
        const { accessToken, expiresUtc }: UserLogInDto = yield call(
            api.user.login,
            {email,password}
        )

        const cookieAttr: CookieAttributes = {
            secure: !(window as any).isDebug
        }

        // if cookieAttr.expires is not set, cookie will expire when browser is closed
        if (keepCookieAfterSession)
            cookieAttr.expires = moment
                .utc(expiresUtc)
                .local()
                .toDate()

        Cookies.set(accessTokenCookieName, accessToken, cookieAttr)

        yield put(
            authActions.logInAsync.success()
        )

        yield put(authActions.meAsync.request())
    } catch (e) {
        yield put(authActions.logInAsync.failure(e))
    }
}

export function* userMe() {
    try {
        const user: UserDto = yield call(api.user.me)

        if (!user) {
            throw new Error('User is null.')
        }

        yield put(authActions.meAsync.success(user))
        yield put(authActions.onAuthenticated())
    } catch (e) {
        yield put(authActions.meAsync.failure(e))
    }
}

export function* onAuthenticated(): IterableIterator<void> {
}
