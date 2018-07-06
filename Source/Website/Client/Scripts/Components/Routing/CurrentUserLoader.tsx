import * as React from 'react'
import { connect } from 'react-redux'
import { actions, IAppState } from 'AppState'
import { MyAsyncRouter } from './MyAsyncRouter'
import { ICancellablePromise } from '@interface-technologies/iti-react'
import { UserDto } from 'Models'
import { isAuthenticated } from 'Api/ApiUtil'
import { api } from 'Api'
import { IError } from 'Components/ProcessError';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface ICurrentUserLoaderProps extends React.Props<any>, RouteComponentProps<any> {
    user: UserDto | null
    setUser(user: UserDto | null): any

    error?: IError
    onError(e: any): void
}

interface ICurrentUserLoaderState {
    queryCompleted: boolean
}

class _CurrentUserLoader extends React.Component<ICurrentUserLoaderProps, ICurrentUserLoaderState> {

    state: ICurrentUserLoaderState = {queryCompleted:false}

    ajaxRequest?: ICancellablePromise<any>

    async componentDidMount() {
        let errorOccurred = false
        let user: UserDto | null = null

        try {
            if (isAuthenticated()) {
                user = await (this.ajaxRequest = api.user.me())
            }
        } catch (e) {
            if (e.status !== 401) {
                // 401 is okay

                this.setState({ queryCompleted: true})
                errorOccurred = true
                this.props.onError(e)
            }
        }

        if (!errorOccurred) {
            this.props.setUser(user)

            // Must come after setting the user!
            this.setState({ queryCompleted: true })
        }
    }

    componentWillUnmount() {
        if (this.ajaxRequest) this.ajaxRequest.cancel()
    }

    render() {
        const {error, onError } = this.props
        const { queryCompleted} = this.state

        if (queryCompleted) {
            return <MyAsyncRouter error={error} onError={onError} key="MyAsyncRouter"/>
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
export const CurrentUserLoader = withRouter(connect(
    mapStateToProps,
    actionsMap
)(_CurrentUserLoader))
