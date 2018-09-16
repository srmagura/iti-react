import * as React from 'react'
import { connect } from 'react-redux'
import { actions, IAppState } from 'AppState'
import { MyAsyncRouter } from './MyAsyncRouter'
import { CancellablePromise } from '@interface-technologies/iti-react'
import { UserDto, ErrorDto, ErrorType } from 'Models'
import { isAuthenticated } from 'Api/ApiUtil'
import { api } from 'Api'
import { IError } from 'Components/ProcessError'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import * as Cookies from 'js-cookie'
import { accessTokenCookieName } from 'Components/Constants'

interface ICurrentUserLoaderProps extends React.Props<any>, RouteComponentProps<any> {
    user: UserDto | null
    setUser(user: UserDto | null): any

    error?: IError
    onError(e: any): void
}

interface ICurrentUserLoaderState {
    queryCompleted: boolean
}

class _CurrentUserLoader extends React.Component<
    ICurrentUserLoaderProps,
    ICurrentUserLoaderState
> {
    state: ICurrentUserLoaderState = { queryCompleted: false }

    ajaxRequest?: CancellablePromise<any>

    async componentDidMount() {
        let errorOccurred = false
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
        this.setState({ queryCompleted: true })
    }

    componentWillUnmount() {
        if (this.ajaxRequest) this.ajaxRequest.cancel()
    }

    render() {
        const { error, onError } = this.props
        const { queryCompleted } = this.state

        if (queryCompleted) {
            return <MyAsyncRouter error={error} onError={onError} key="MyAsyncRouter" />
        } else {
            // if we render pages before we've gotten the user, a logged in user will get redirected
            // to the log in page because user=null
            return null
        }
    }
}

function mapStateToProps(state: IAppState) {
    return {
        user: state.user
    }
}

const actionsMap = { setUser: actions.setUser }

// withRouter must wrap connect to prevent update blocking
export const CurrentUserLoader = withRouter(
    connect(
        mapStateToProps,
        actionsMap
    )(_CurrentUserLoader)
)
