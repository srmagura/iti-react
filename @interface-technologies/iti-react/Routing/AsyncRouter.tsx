﻿import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Location } from 'history'
import { areLocationsEqualIgnoringKey } from '../Util'

/* Gotchas with AsyncRouter:
 *
 * - Do not push to history in componentDidMount(). This will lead to incorrect
 *   onReadyArgs being applied. If you want to push to history immediately after
 *   a page loads, do it in componentDidUpdate instead. See
 *   Pages/Home/RedirectingPage.tsx for an example of this.
 *
 * - If you want to be able to change the route parameters without the page
 *   unmounting and remounting, you should implement getLocationKey,
 *   so that the page has the same location key regardless of the route
 *   params.
 *
 *   Example: you want to be able to navigate from /job/list/0 to /job/list/1
 *   without the page remounting. You should make getLocationKey return
 *   '/job/list' for any path thats match '/job/list/:page?'. Use matchPath
 *   for this.
 *
 *   LocationKey is NOT the same as the key property of the location object.
 *
 * - When implementing getLocationKey, if the current path does not correspond to
 *   a route in your application, you must return the current path without any modifications.
 *
 *   Consider this example to see why you must return the path unmodified. Say you have a route
 *   '/job/list/:page?' and you have implemented getLocationKey to return '/job/list' for any
 *   path that starts with '/job/list'. The user enters '/job/list/bogus/path/here' into the URL bar.
 *   The 'Page not found' page will be rendered. Then the user clicks the navbar link to the job list.
 *   The location key does not change when the location changes, so AsyncRouter does not unmount the
 *   previous page and mount the new page. But the two pages are actually different! So yeah
 *   weird stuff can happen if you implement getLocationKey like this. Only use matchPath in
 *   getLocationKey!
 */

interface AsyncRouterProps<TOnReadyArgs> extends RouteComponentProps<any> {
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

interface AsyncRouterState<TOnReadyArgs> {
    displayedLocationIsReady: boolean
    displayedLocation: Location
    loadingLocation?: Location

    onReadyArgs?: TOnReadyArgs
    navigationInProgress: boolean
}

function _getAsyncRouter<TOnReadyArgs>(): React.ComponentClass<
    AsyncRouterProps<TOnReadyArgs>
> {
    return class AsyncRouter extends React.Component<
        AsyncRouterProps<TOnReadyArgs>,
        AsyncRouterState<TOnReadyArgs>
    > {
        constructor(props: AsyncRouterProps<TOnReadyArgs>) {
            super(props)

            this.state = {
                displayedLocation: props.location,
                displayedLocationIsReady: false,
                // initial page is loading
                navigationInProgress: true
            }
        }

        onNavigationDone = () => {
            window.scrollTo(0, 0)
            this.props.onNavigationDone()
        }

        // this probably should be merged into componentDidUpdate
        static getDerivedStateFromProps(
            nextProps: AsyncRouterProps<TOnReadyArgs>,
            prevState: AsyncRouterState<TOnReadyArgs>
        ) {
            const nextLocation = nextProps.location
            const { getLocationKey } = nextProps
            const { displayedLocation } = prevState

            //console.log(`receivedPath('${nextLocation.pathname}')`)
            //console.log(`    displayedLocation=${displayedLocation && displayedLocation.pathname}   loadingLocation=${loadingLocation && loadingLocation.pathname}`)

            if (typeof displayedLocation !== 'undefined') {
                const locationChanged = !areLocationsEqualIgnoringKey(
                    displayedLocation,
                    nextLocation
                )

                const locationKeyChanged =
                    getLocationKey(displayedLocation) !== getLocationKey(nextLocation)

                if (locationChanged) {
                    if (!locationKeyChanged) {
                        // Should not reload page when location key is the same - this is the whole
                        // point of location keys
                        return {
                            displayedLocation: nextLocation
                        }
                    }

                    return {
                        loadingLocation: nextLocation
                    }
                }
            }

            return null
        }

        componentDidUpdate(
            prevProps: AsyncRouterProps<TOnReadyArgs>,
            prevState: AsyncRouterState<TOnReadyArgs>
        ) {
            const { location, getLocationKey, onNavigationStart, onReady } = this.props
            const {
                loadingLocation,
                navigationInProgress,
                onReadyArgs,
                displayedLocation
            } = this.state
            const prevLocation = prevProps.location

            //console.log('component updated:')
            //console.log({
            //    location: location.pathname,
            //    prevLocation: prevLocation && prevLocation.pathname,
            //    loadingLocation: loadingLocation && loadingLocation.pathname,
            //    locationKeys: {
            //        prevLocation: getLocationKey(prevLocation),
            //        location: getLocationKey(location),
            //    },
            //    navigationInProgress: navigationInProgress,
            //    onReadyArgsExist: !!onReadyArgs,
            //    displayedLocation: displayedLocation && displayedLocation.pathname,
            //})

            if (
                !navigationInProgress &&
                getLocationKey(location) !== getLocationKey(prevLocation)
            ) {
                // normal navigation start
                onNavigationStart()

                this.setState({ navigationInProgress: true })
                return
            }

            if (navigationInProgress && onReadyArgs) {
                // normal navigation done
                this.onNavigationDone()
                onReady(onReadyArgs)

                this.setState({
                    onReadyArgs: undefined,
                    navigationInProgress: false,

                    displayedLocation: location,
                    displayedLocationIsReady: true,
                    loadingLocation: undefined
                })

                return
            }

            if (
                loadingLocation &&
                getLocationKey(location) === getLocationKey(displayedLocation)
            ) {
                // We got redirected to the page we're already on
                this.onNavigationDone()

                this.setState(s => ({
                    ...s,
                    loadingLocation: undefined,
                    navigationInProgress: false
                }))

                return
            }
        }

        onReady = (location: Location, args: TOnReadyArgs) => {
            const { loadingLocation, displayedLocationIsReady } = this.state

            //console.log(`onReady(${location && location.pathname})`)

            //console.log({
            //    displayedLocationIsReady,
            //    loadingLocation: loadingLocation ? loadingLocation.pathname : undefined,
            //    locationsAreEqual: loadingLocation ? locationsAreEqual(location, loadingLocation) : undefined,
            //})

            if (
                displayedLocationIsReady &&
                (!loadingLocation ||
                    !areLocationsEqualIgnoringKey(location, loadingLocation))
            ) {
                // ignore any unexpected calls to onReady.
                // if the user begins navigation to one page, but then interrupts the navigation by clicking
                // on a link, we can still get an onReady call from the first page. This call must be ignored,
                // or else weirdness will occur.

                // the following line should stay UNCOMMENTED
                console.log(
                    'Ignoring unexpected call to onReady',
                    location,
                    loadingLocation
                )
                return
            }

            this.setState({
                onReadyArgs: args
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
                    onReady: args => this.onReady(displayedLocation, args)
                })
            ]

            if (
                loadingLocation &&
                getLocationKey(loadingLocation) !== getLocationKey(displayedLocation)
            ) {
                pages.push(
                    renderRoutes({
                        location: loadingLocation,
                        key: getLocationKey(loadingLocation),
                        ready: false,
                        onReady: args => this.onReady(loadingLocation, args)
                    })
                )
            }

            return renderLayout(pages)
        }
    }
}

export function getAsyncRouter<TOnReadyArgs>() {
    return withRouter(_getAsyncRouter<TOnReadyArgs>())
}