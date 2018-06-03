import * as React from 'react';
import { Route, withRouter, RouteComponentProps } from 'react-router-dom';
import { Location, History, locationsAreEqual } from 'history';

interface IAsyncRouterProps<TOnReadyArgs> extends RouteComponentProps<any> {
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

interface IAsyncRouterState<TOnReadyArgs> {
    displayedLocationIsReady: boolean
    displayedLocation: Location
    loadingLocation?: Location

    navigationInProgress: boolean
    onReadyArgs?: TOnReadyArgs
}

function _getAsyncRouter<TOnReadyArgs>(): React.ComponentClass<IAsyncRouterProps<TOnReadyArgs>> {
    return class AsyncRouter extends React.Component<IAsyncRouterProps<TOnReadyArgs>, IAsyncRouterState<TOnReadyArgs>> {

        constructor(props: IAsyncRouterProps<TOnReadyArgs>) {
            super(props)

            this.state = {
                displayedLocation: props.location,
                displayedLocationIsReady: false,
                // initial page is loading
                navigationInProgress: true, 
            }
        }

        static getDerivedStateFromProps(nextProps: IAsyncRouterProps<TOnReadyArgs>, prevState: IAsyncRouterState<TOnReadyArgs>) {
            const nextLocation = nextProps.location
            const { getLocationKey, } = nextProps
            const { displayedLocation, loadingLocation } = prevState

            //console.log(`receivedPath('${nextLocation.pathname}')`)
            //console.log(`    displayedLocation=${displayedLocation && displayedLocation.pathname}   loadingLocation=${loadingLocation && loadingLocation.pathname}`)

            if (typeof displayedLocation !== 'undefined' && 
                displayedLocation.pathname !== nextLocation.pathname) {

                return {
                    loadingLocation: nextLocation,
                }
            }

            return null
        }

        componentDidUpdate(prevProps: IAsyncRouterProps<TOnReadyArgs>, prevState: IAsyncRouterState<TOnReadyArgs>) {
            const { location, getLocationKey, onNavigationDone, onNavigationStart, onReady } = this.props
            const { loadingLocation, navigationInProgress, onReadyArgs } = this.state
            const prevDisplayedLocation = prevState.displayedLocation

            console.log(`component updated path=${location.pathname}`)
            console.log(`    prevDisplayedLocation=${prevDisplayedLocation && prevDisplayedLocation.pathname}   loadingLocation=${loadingLocation && loadingLocation.pathname}`)

            if (typeof loadingLocation !== 'undefined' && !navigationInProgress) {
                // navigation started
                onNavigationStart()

                this.setState({ navigationInProgress: true })
                return
            }

            if (navigationInProgress && onReadyArgs) {
                // normal navigation done
                onNavigationDone()
                onReady(onReadyArgs)

                this.setState({
                    onReadyArgs: undefined,
                    navigationInProgress: false,

                    displayedLocation: location,
                    displayedLocationIsReady: true,
                    loadingLocation: undefined,
                })

                return
            }

            //if (typeof prevDisplayedLocation !== 'undefined' &&
            //    getLocationKey(location) === getLocationKey(prevDisplayedLocation)) {

            //    if (typeof loadingLocation !== 'undefined') {
            //        // We got redirected to the page we are already on
            //        onNavigationDone()

            //        this.setState(s => ({
            //            ...s,
            //            loadingLocation: undefined,
            //            displayedLocation: location,
            //        }))
            //    }

            //    return
            //}

        }

        onReady = (location: Location, args: TOnReadyArgs) => {
            const { onNavigationDone, onReady } = this.props
            const { loadingLocation, displayedLocationIsReady } = this.state

            console.log(`onReady(${location && location.pathname})`)

            if (displayedLocationIsReady &&
                (
                    !loadingLocation ||
                    !locationsAreEqual(location, loadingLocation))) {
                // ignore any unexpected calls to onReady.
                // if the user begins navigation to one page, but then interrupts the navigation by clicking
                // on a link, we can still get an onReady call from the first page. This call must be ignored,
                // or else weirdness will occur.

                //console.log('Ignoring unexpected call to onReady')
                return
            }

            this.setState({
                onReadyArgs: args,
            })
        }

        render() {
            const { renderRoutes, renderLayout, getLocationKey } = this.props
            const {
                displayedLocation,
                loadingLocation,
                displayedLocationIsReady
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
}

export function getAsyncRouter<TOnReadyArgs>() {
    return withRouter(_getAsyncRouter<TOnReadyArgs>())
}
