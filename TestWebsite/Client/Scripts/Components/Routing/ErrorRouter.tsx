import * as React from 'react'
import { Route, withRouter, RouteComponentProps, matchPath } from 'react-router-dom'
import { Layout } from 'Components/Layout'
import { Location, locationsAreEqual, History } from 'history'
import { Routes } from 'Routes'
import { IOnReadyArgs } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components/Header'
import { ErrorDto } from 'Models'
import { processError, IError, ErrorType } from 'Components/ProcessError'
import { MyAsyncRouter } from 'Components/Routing/MyAsyncRouter'
import { CurrentUserLoader } from './CurrentUserLoader'

interface ErrorRouterProps extends RouteComponentProps<any> {}

interface ErrorRouterState {
    error?: IError
}

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

        return <CurrentUserLoader error={error} onError={this.onError} />
    }
}

export const ErrorRouter = withRouter(_ErrorRouter)
