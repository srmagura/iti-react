import React from 'react'
import { connect } from 'react-redux'
import { AppState } from '_Redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'

interface UserGuardProps extends RouteComponentProps<any> {
    initialUserLoadInProgress: boolean
}

function _UserGuard(props: React.PropsWithChildren<UserGuardProps>) {
    const { initialUserLoadInProgress } = props

    if (initialUserLoadInProgress) {
        // if we render pages before we've gotten the user, a logged in user will get redirected
        // to the log in page because user=null
        return null
    }

    return <>{props.children}</>
}

function mapStateToProps(state: AppState) {
    return {
        initialUserLoadInProgress:
            state.auth.meRequestStatus.inProgress &&
            !state.auth.logInRequestStatus.inProgress,
    }
}

// withRouter must wrap connect to prevent update blocking
export const UserGuard = withRouter(connect(mapStateToProps)(_UserGuard))
