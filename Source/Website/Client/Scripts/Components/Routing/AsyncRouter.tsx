import * as React from 'react';
import { Route, withRouter, RouteComponentProps } from 'react-router-dom';
import { Layout } from 'Components/Layout';
import { Location } from 'history';
import { Routes } from 'Routes';
import { IOnReadyArgs } from 'Components/Routing/RouteProps';
import { NavbarLink } from 'Components/Header';
import { ErrorDto } from 'Models';
import { processError } from 'Components/ProcessError';

export interface IRouteContextData {
    onNavigationStart(path: string): void
}

export const RouteContext = React.createContext<IRouteContextData>({ onNavigationStart: () => {}})

interface IAsyncRouterState {
    loadingPath?: string
    activeNavbarLink?: NavbarLink
    pageId?: string
    error?: ErrorDto
}

class _AsyncRouter extends React.Component<RouteComponentProps<any>, IAsyncRouterState> {

    state: IAsyncRouterState = {
    }

    onNavigationStart = (path: string) => {
        this.setState({
            loadingPath: path
        })
    }

    onReady = ({ pageId, activeNavbarLink, title }: IOnReadyArgs) => {
        const { history } = this.props
        const { loadingPath } = this.state

        document.title = title

        history.push(loadingPath as string)
        this.setState({
            loadingPath: undefined,
            pageId,
            activeNavbarLink
        })
    }

    onError = (e: any) => {
        const error = processError(e)

        if (error) {
            this.setState({ error })
            this.onNavigationStart('/home/error')
        }
    }

    render() {
        const { history } = this.props
        const { loadingPath, activeNavbarLink, pageId, error } = this.state

        const location = history.location

        const routeProps = {
            error: error,
            onError: this.onError,
            onReady: this.onReady,
            onNavigationStart: this.onNavigationStart
        }

        const pages = [
            <Routes location={location} key={location.pathname}
                ready={true}
                {...routeProps} />
        ]

        if (loadingPath && loadingPath !== location.pathname) {
            const locationCopy = { ...location }
            locationCopy.pathname = loadingPath
            pages.push(<Routes location={locationCopy} key={loadingPath}
                ready={false}
                {...routeProps} />)
        }

        return (
            <RouteContext.Provider value={{ onNavigationStart: this.onNavigationStart }}>
                <Layout activeNavbarLink={activeNavbarLink} pageId={pageId}>
                    {pages}
                </Layout>
            </RouteContext.Provider>
        )
    }
}

export const AsyncRouter = withRouter(_AsyncRouter)