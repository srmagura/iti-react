import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { processError, IError, ErrorType } from 'Components/ProcessError'
import { UserGuard } from './UserGuard'

interface ErrorRouterProps extends RouteComponentProps<any> {}

interface ErrorRouterState {
    error?: IError
}

// THIS IS OLD, DO NOT BASE ANY FUTURE CODE OFF THIS
class _ErrorRouter extends React.Component<ErrorRouterProps, ErrorRouterState> {
    state: ErrorRouterState = {}

    onError = (e: any) => {
        const { history } = this.props

        const error = processError(e)

        if (error.type === ErrorType.CancelledAjaxRequest) {
            // ignore, since this can happen when a user clicks a link for Page 2
            // while Page 1 is still loading
            return
        }

        if (error) {
            console.warn(e)

            this.setState({ error })
            history.replace('/home/error')
        }
    }

    render() {
        const { error } = this.state

        return <UserGuard error={error} onError={this.onError} />
    }
}

export const ErrorRouter = withRouter(_ErrorRouter)
