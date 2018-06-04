import * as React from 'react'
import {
    Route,
    withRouter,
    RouteComponentProps,
    matchPath
} from 'react-router-dom'
import { Layout } from 'Components/Layout'
import { Location, locationsAreEqual, History } from 'history'
import { Routes } from 'Routes'
import { IOnReadyArgs } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components/Header'
import { ErrorDto } from 'Models'
import { processError, IError, ErrorType } from 'Components/ProcessError'
import { MyAsyncRouter } from 'Components/Routing/MyAsyncRouter'

interface IErrorRouterProps extends RouteComponentProps<any> {}

interface IErrorRouterState {
    error?: IError
}

class _ErrorRouter extends React.Component<
    IErrorRouterProps,
    IErrorRouterState
> {
    state: IErrorRouterState = {}

    logError = (e: any, error: any, redirectedToErrorPage: boolean) => {
        const userAgent = window.navigator.userAgent
        const url = window.location.href

        const logMsg = JSON.stringify({
            message: e.message,
            stack: e.stack,
            error,
            userAgent,
            url,
            redirectedToErrorPage: !!error
        })

        // TODO
        // no await - fire & forget
        //api.log.warning({ message: logMsg })
    }

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
            history.push('/home/error')
        }

        this.logError(e, error, !!error)
    }

    render() {
        const { error } = this.state

        return <MyAsyncRouter error={error} onError={this.onError} />
    }
}

export const ErrorRouter = withRouter(_ErrorRouter)
