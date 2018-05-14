import * as React from 'react';
import { Route, withRouter, RouteComponentProps } from 'react-router-dom';
import { Layout } from 'Components/Layout';
import { Location, History, locationsAreEqual } from 'history';
import { Routes } from 'Routes';
import { IOnReadyArgs } from 'Components/Routing/RouteProps';
import { NavbarLink } from 'Components/Header';
import { IError, ErrorType, processError } from 'Components/ProcessError';

declare const NProgress: any
NProgress.configure({ parent: '.body-container-wrapper' })


interface IAsyncRouterProps extends RouteComponentProps<any> {
    error?: IError
    onError(e: any): void
}

interface IAsyncRouterState {
    displayedLocationIsReady: boolean
    displayedLocation: Location
    loadingLocation?: Location

    activeNavbarLink?: NavbarLink
    pageId?: string
}

class _AsyncRouter extends React.Component<IAsyncRouterProps, IAsyncRouterState> {

    constructor(props: IAsyncRouterProps) {
        super(props)

        this.state = {
            displayedLocation: props.location,
            displayedLocationIsReady: false,
        }
    }

    getLocationKey = (location: Location) => {
        const pathname = location.pathname.toLowerCase()

        // don't remount the page when the date URL param changes
        if (pathname.indexOf('/job/board') !== -1) {
            return '/job/board'
        }

        return pathname
    }

    componentWillReceiveProps(nextProps: IAsyncRouterProps) {
        const nextLocation = nextProps.location
        const { displayedLocation, loadingLocation } = this.state

        //console.log(`receivedPath('${nextLocation.pathname}')`)
        //console.log(`    displayedLocation=${displayedLocation}   loadingLocation=${loadingLocation}`)

        if (this.getLocationKey(nextLocation) === this.getLocationKey(displayedLocation)) {
            if (typeof this.state.loadingLocation !== 'undefined') {
                // We got redirected to the page we are already on
                this.setState(s => ({ ...s, loadingLocation: undefined }))
                NProgress.done()
            }

            // even though location keys are the same, locations could be different
            this.setState(s => ({ ...s, displayedLocation: nextLocation }))
        } else {
            // Normal navigation
            if (nextLocation !== this.state.loadingLocation) {
                NProgress.start()

                this.setState({
                    loadingLocation: nextLocation
                })
            }
        }
    }

    onReady = (location: Location, { pageId, activeNavbarLink, title }: IOnReadyArgs) => {
        const currentLocation = this.props.location
        const { loadingLocation, displayedLocationIsReady } = this.state

        if (displayedLocationIsReady && (
            !loadingLocation ||
            !locationsAreEqual(location, loadingLocation))) {
            // ignore any unexpected calls to onReady.
            // if the user begins navigation to one page, but then interrupts the navigation by clicking
            // on a link, we can still get an onReady call from the first page. This call must be ignored,
            // or else weirdness will occur.
            return
        }

        //console.log(`onReady({title: '${title}'})`)
        NProgress.done()

        const _window = window as any
        if (_window.loadingScreen) {
            _window.loadingScreen.finish()
            _window.loadingScreen = undefined
        }

        document.title = title + ' - Capital City Curb & Gutter'

        this.setState({
            displayedLocation: currentLocation,
            displayedLocationIsReady: true,
            loadingLocation: undefined,
            pageId,
            activeNavbarLink,
        })
    }

    render() {
        const { error } = this.props
        const {
            displayedLocation, loadingLocation, activeNavbarLink, pageId,
            displayedLocationIsReady
        } = this.state

        const routeProps = {
            error: error,
            onError: this.props.onError,
            history: this.props.history
        }

        const pages = [
            <Routes location={displayedLocation} key={this.getLocationKey(displayedLocation)}
                ready={displayedLocationIsReady}
                onReady={args => this.onReady(displayedLocation, args)}
                {...routeProps} />
        ]

        if (loadingLocation && loadingLocation.pathname !== displayedLocation.pathname) {
            pages.push(<Routes location={loadingLocation} key={this.getLocationKey(loadingLocation)}
                ready={false}
                onReady={args => this.onReady(loadingLocation, args)}
                {...routeProps} />)
        }

        return <Layout activeNavbarLink={activeNavbarLink} pageId={pageId}>
            {pages}
        </Layout>
    }
}

export const AsyncRouter = withRouter(_AsyncRouter)
