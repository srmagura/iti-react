import * as Cookies from 'js-cookie'
import { accessTokenCookieName } from 'Components'
import { History } from 'history'
import { defer } from 'lodash'
import { store, actions } from '_Redux';

export function logOut(history: History) {
    Cookies.remove(accessTokenCookieName)

    // has the side effect of redirecting the user to the login page
    store.dispatch(actions.auth.logOut())

    // get rid of the "requested" URL parameter
    defer(() => history.replace('/home/logIn'))
}
