import * as React from 'react'
import { connect } from 'react-redux'
import { actions, IAppState } from 'AppState'
import { MyAsyncRouter } from './MyAsyncRouter'
import { ICancellablePromise } from '@interface-technologies/iti-react'
import { UserDto } from 'Models'
import { isAuthenticated } from 'Api/ApiUtil'
import { api } from 'Api'

interface IMeLoaderProps extends React.Props<any> {
    user: UserDto | null
    setUser(user: UserDto | null): any

    onError(e: any): void
}

class _MeLoader extends React.Component<IMeLoaderProps> {
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
                errorOccurred = true
                this.props.onError(e)
            }
        }

        if (!errorOccurred) {
            this.props.setUser(user)
        }
    }

    componentWillUnmount() {
        if (this.ajaxRequest) this.ajaxRequest.cancel()
    }

    render() {
        return null
    }
}

function mapStateToProps(state: IAppState) {
    return {
        user: state.user
    }
}

const actionsMap = { setUser: actions.setUser }

// withRouter must wrap connect to prevent update blocking
export const MeLoader = connect(
    mapStateToProps,
    actionsMap
)(_MeLoader)
