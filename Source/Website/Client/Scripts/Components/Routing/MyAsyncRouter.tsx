import * as React from 'react'
import { Route, withRouter, RouteComponentProps, matchPath } from 'react-router-dom'
import { Layout } from 'Components/Layout'
import { Location, History, locationsAreEqual } from 'history'
import { Routes } from 'Routes'
import { IOnReadyArgs } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components/Header'
import { IError, ErrorType, processError } from 'Components/ProcessError'
import { getAsyncRouter } from '@interface-technologies/iti-react'
import { paths as testPaths } from 'Pages/Test/TestRoutes'

const AsyncRouter = getAsyncRouter<IOnReadyArgs>()

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
    state: IMyAsyncRouterState = {}

    onReady = (args: IOnReadyArgs) => {
        const { title, activeNavbarLink, pageId } = args

        const _window = window as any
        if (_window.loadingScreen) {
            _window.loadingScreen.finish()
            _window.loadingScreen = undefined
        }

        document.title = title + ' - React SPA Template'

        this.setState({ activeNavbarLink, pageId })
    }

    /* When implementing getLocationKey, if the current path does not correspond to
     * a route in your application, you must return the current path without any modifications.
     * Otherwise bad stuff will happen. Additional explanation in iti-react AsyncRouter.tsx.
     *
     * To avoid the problem, when writing getLocationKey(), only use matchPath(), never path.startsWith().
     */
    getLocationKey = (location: Location) => {
        const myMatchPath = (p: string) =>
            matchPath(location.pathname, {
                path: p,
                exact: true
            })

        if (myMatchPath(testPaths.urlParam)) return '/test/urlparam'

        return location.pathname.toLowerCase()
    }

    renderRoutes = (args: {
        location: Location
        key: string
        ready: boolean
        onReady(args: IOnReadyArgs): void
    }) => {
        const { error, onError } = this.props

        return <Routes {...args} error={error} onError={onError} />
    }

    renderLayout = (children: React.ReactNode[]) => {
        const { activeNavbarLink, pageId } = this.state

        return (
            <Layout activeNavbarLink={activeNavbarLink} pageId={pageId}>
                {children}
            </Layout>
        )
    }

    render() {
        return (
            <AsyncRouter
                renderRoutes={this.renderRoutes}
                renderLayout={this.renderLayout}
                getLocationKey={this.getLocationKey}
                onNavigationStart={() => NProgress.start()}
                onNavigationDone={() => NProgress.done()}
                onReady={this.onReady}
            />
        )
    }
}

export const MyAsyncRouter = withRouter(_MyAsyncRouter)
