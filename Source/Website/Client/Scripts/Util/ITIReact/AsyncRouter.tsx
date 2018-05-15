import * as React from 'react';
import { Route, withRouter, RouteComponentProps } from 'react-router-dom';
import { Location, History, locationsAreEqual } from 'history';

/*    error?: IError
    onError(e: any): void */

/*
    activeNavbarLink?: NavbarLink
    pageId?: string */

type TOnReadyArgs = { }

interface IAsyncRouterProps extends RouteComponentProps<any> {
    renderRoutes(args: {
        location: Location
        key: string
        ready: boolean
        onReady(args: TOnReadyArgs): void
    }): React.ReactNode

    renderLayout(children: React.ReactNode[]): React.ReactNode
    getLocationKey(location: Location): string

    onNavigationStart(): void
    onNavigationDone(): void
    onReady(args: TOnReadyArgs): void
}

interface IAsyncRouterState {
    displayedLocationIsReady: boolean
    displayedLocation: Location
    loadingLocation?: Location
}

class _AsyncRouter extends React.Component<IAsyncRouterProps, IAsyncRouterState> {

    constructor(props: IAsyncRouterProps) {
        super(props)

        this.state = {
            displayedLocation: props.location,
            displayedLocationIsReady: false,
        }
    }

    componentWillReceiveProps(nextProps: IAsyncRouterProps) {
        const nextLocation = nextProps.location
        const { getLocationKey, onNavigationStart, onNavigationDone } = nextProps
        const { displayedLocation, loadingLocation } = this.state

       //console.log(`receivedPath('${nextLocation.pathname}')`)
        //console.log(`    displayedLocation=${displayedLocation}   loadingLocation=${loadingLocation}`)

        if (getLocationKey(nextLocation) === getLocationKey(displayedLocation)) {
            if (typeof this.state.loadingLocation !== 'undefined') {
                // We got redirected to the page we are already on
                this.setState(s => ({ ...s, loadingLocation: undefined }))
                onNavigationDone()
            }

            // even though location keys are the same, locations could be different
            this.setState(s => ({ ...s, displayedLocation: nextLocation }))
        } else {
            // Normal navigation
            if (nextLocation !== this.state.loadingLocation) {
                onNavigationStart()

                this.setState({
                    loadingLocation: nextLocation
                })
            }
        }
    }

    onReady = (location: Location, args: TOnReadyArgs) => {
        const currentLocation = this.props.location
        const { onNavigationDone, onReady } = this.props
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

        onNavigationDone()
        onReady(args)
      
        this.setState({
            displayedLocation: currentLocation,
            displayedLocationIsReady: true,
            loadingLocation: undefined,
        })
    }

    render() {
        const { renderRoutes, renderLayout, getLocationKey } = this.props
        const {
            displayedLocation, loadingLocation, displayedLocationIsReady
        } = this.state

        const pages = [
            renderRoutes({
                location: displayedLocation,
                key: getLocationKey(displayedLocation),
                ready: displayedLocationIsReady,
                onReady: args => this.onReady(displayedLocation, args),
            })
        ]

        if (loadingLocation && loadingLocation.pathname !== displayedLocation.pathname) {
            pages.push(renderRoutes({
                location: loadingLocation,
                key: getLocationKey(loadingLocation),
                ready: false,
                onReady: args => this.onReady(loadingLocation, args),
            }))
        }

        return renderLayout(pages)
    }
}

export const AsyncRouter = withRouter(_AsyncRouter)
