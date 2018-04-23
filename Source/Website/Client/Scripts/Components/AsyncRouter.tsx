import * as React from 'react';
import { Route, withRouter, RouteComponentProps } from 'react-router-dom';
import { Layout } from 'Components/Layout';
import { Location } from 'history';
import { Routes } from 'Routes';
import { IOnReadyArgs } from 'Components/RouteProps';
import { NavbarLink } from 'Components/Header';

interface IRouteContextData {
    onNavigationStart(path: string): void
}

export const RouteContext = React.createContext<IRouteContextData>()

interface IAsyncRouterState {
    loadingPath?: string
    activeNavbarLink?: NavbarLink
    pageId?: string
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

        history.push(loadingPath)
        this.setState({
            loadingPath: undefined,
            pageId,
            activeNavbarLink
        })
    }

    render() {
        const { history } = this.props
        const { loadingPath, activeNavbarLink, pageId } = this.state

        const location = history.location

        const routeProps = {
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