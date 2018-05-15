import * as React from 'react';
import { Route, withRouter, RouteComponentProps } from 'react-router-dom';
import { Layout } from 'Components/Layout';
import { Location, History, locationsAreEqual } from 'history';
import { Routes } from 'Routes';
import { IOnReadyArgs } from 'Components/Routing/RouteProps';
import { NavbarLink } from 'Components/Header';
import { IError, ErrorType, processError } from 'Components/ProcessError';
import { AsyncRouter } from 'Util/ITIReact';

declare const NProgress: any
NProgress.configure({ parent: '.body-container-wrapper' })

interface IMyAsyncRouterProps extends RouteComponentProps<any> {
    error?: IError
    onError(e: any): void
}

interface IMyAsyncRouterState {
    activeNavbarLink?: NavbarLink
    pageId?: string
}

class _MyAsyncRouter extends React.Component<IMyAsyncRouterProps, IMyAsyncRouterState> {

    onReady = () => {
        const _window = window as any
        if (_window.loadingScreen) {
            _window.loadingScreen.finish()
            _window.loadingScreen = undefined
        }

        // document.title = title + ' - React SPA Template'
    }

    getLocationKey = (location: Location) => {
        return location.pathname.toLowerCase()
    }

    renderRoutes = (args: {
        location: Location
        key: string
        ready: boolean
        onReady(args: {}): void
    }) => {
        const { error, onError } = this.props

        return <Routes {...args}
            error={error}
            onError={onError} />
    }

    renderLayout = (children: React.ReactNode[]) => {
        return <Layout>
            {children}
        </Layout>
    }

    render() {
        return <AsyncRouter
            renderRoutes={this.renderRoutes}
            renderLayout={this.renderLayout}
            getLocationKey={this.getLocationKey}
            onNavigationStart={() => NProgress.start()}
            onNavigationDone={() => NProgress.done()}
            onReady={this.onReady} />
    }
}

export const MyAsyncRouter = withRouter(_MyAsyncRouter)
