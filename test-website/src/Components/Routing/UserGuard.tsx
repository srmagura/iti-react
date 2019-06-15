﻿import * as React from 'react'
import { connect } from 'react-redux'
import { AppState } from '_Redux'
import { MyAsyncRouter } from './MyAsyncRouter'
import { IError } from 'Components/ProcessError'
import { withRouter, RouteComponentProps } from 'react-router-dom'

/*         let errorOccurred = false
        let user: UserDto | null = null

        try {
            if (isAuthenticated()) {
                user = await (this.ajaxRequest = api.user.me())
            }
        } catch (e) {
            if (
                e.status === 500 &&
                (JSON.parse(e.responseText) as ErrorDto).errorType ===
                    ErrorType.UserDoesNotExist
            ) {
                // Resetting users in the DB means your cookie now has an ID for a user that
                // no longer exists. When this happens, delete the cookie.
                // The user will get redirected to the login page.
                Cookies.remove(accessTokenCookieName)
            } else if (e.status === 401) {
                // 401 means token is invalid - this doesn't warrant showing an error
            } else {
                this.props.onError(e)
            }

            errorOccurred = true
        }

        if (!errorOccurred) {
            this.props.setUser(user)
        }

        // Must come after setting the user!
        this.setState({ queryCompleted: true })*/

interface UserGuardProps extends RouteComponentProps<any> {
    loadingUser: boolean

    error?: IError
    onError(e: any): void
}

function _UserGuard(props: UserGuardProps) {
    const { loadingUser, error, onError } = props

        if (loadingUser) {
            // if we render pages before we've gotten the user, a logged in user will get redirected
            // to the log in page because user=null
            return null
        }

            return <MyAsyncRouter error={error} onError={onError} key="MyAsyncRouter" />
}

function mapStateToProps(state: AppState) {
    return {
        loadingUser: state.auth.meRequestStatus.inProgress
    }
}

// withRouter must wrap connect to prevent update blocking
export const UserGuard = withRouter(
    connect(
        mapStateToProps,
    )(_UserGuard)
)
