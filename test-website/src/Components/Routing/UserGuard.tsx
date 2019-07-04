import * as React from 'react'
import { connect } from 'react-redux'
import { AppState } from '_Redux'
import { MyAsyncRouter } from './MyAsyncRouter'
import { IError } from 'Components/ProcessError'
import { withRouter, RouteComponentProps } from 'react-router-dom'

// TODO: use better design from CdsNext
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
