import * as React from 'react';
import { Route, withRouter, RouteComponentProps } from 'react-router-dom';
import { Layout } from 'Components/Layout';
import { Location } from 'history';
import { Routes } from 'Routes';
import { IOnReadyArgs } from 'Components/RouteProps';

interface IRouteContextData {
    onNavigationStart(path: string): void
}

export const RouteContext = React.createContext<IRouteContextData>()

interface IAsyncRouterState {
    loadingPath?: string
}

class _AsyncRouter extends React.Component<RouteComponentProps<any>, IAsyncRouterState> {

    state: IAsyncRouterState = {
        loadingPath: undefined,
    }

    onNavigationStart = (path: string) => {
        this.setState({
            loadingPath: path
        })
    }

    onReady = ({ title }: IOnReadyArgs) => {
        const { history } = this.props
        const { loadingPath } = this.state

        document.title = title

        history.push(loadingPath)
        this.setState({ loadingPath: undefined })
    }

    render() {
        const { history } = this.props
        const { loadingPath } = this.state

        const location = history.location

        const pages = [
            <Routes location={location} key={location.pathname}
                ready={true}
                onReady={this.onReady} />
        ]

        if (loadingPath && loadingPath !== location.pathname) {
            const locationCopy = { ...location }
            locationCopy.pathname = loadingPath
            pages.push(<Routes location={locationCopy} key={loadingPath}
                ready={false}
                onReady={this.onReady} />)
        }

        return (
            <RouteContext.Provider value={{ onNavigationStart: this.onNavigationStart }}>
                <Layout>
                    {pages}
                </Layout>
            </RouteContext.Provider>
        )
    }
}

export const AsyncRouter = withRouter(_AsyncRouter)