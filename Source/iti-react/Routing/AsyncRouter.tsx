﻿import * as React from 'react'
import { Route, withRouter, RouteComponentProps } from 'react-router-dom'
import { Location, History, locationsAreEqual } from 'history'

/* Gotchas with AsyncRouter:
 *
 * - Do not push to history in componentDidMount(). This will lead to incorrect
 *   onReadyArgs being applied. If you want to push to history immediately after
 *   a page loads, do it in componentDidUpdate instead. See
 *   Pages/Home/RedirectingPage.tsx for an example of this.
 *
 * - If you want to be able to change the URL params without the page
 *   unmounting and remounting, you should implement getLocationKey,
 *   so that the page has the same location key regardless of the URL
 *   params.
 *
 *   Example: you want to be able to navigate from /job/list/0 to /job/list/1
 *   without the page remounting. You should make getLocationKey return
 *   '/job/list' for any path thats match '/job/list/:page?'. Use matchPath
 *   for this.
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

    onReadyArgs?: TOnReadyArgs
    navigationInProgress: boolean
}

function _getAsyncRouter<TOnReadyArgs>(): React.ComponentClass<
    IAsyncRouterProps<TOnReadyArgs>
> {
    return class AsyncRouter extends React.Component<
        IAsyncRouterProps<TOnReadyArgs>,
        IAsyncRouterState<TOnReadyArgs>
    > {
        constructor(props: IAsyncRouterProps<TOnReadyArgs>) {
            super(props)

            this.state = {
                displayedLocation: props.location,
                displayedLocationIsReady: false,
                // initial page is loading
                navigationInProgress: true
            }
        }

        static getDerivedStateFromProps(
            nextProps: IAsyncRouterProps<TOnReadyArgs>,
            prevState: IAsyncRouterState<TOnReadyArgs>
        ) {
            const nextLocation = nextProps.location
            const { getLocationKey } = nextProps
            const { displayedLocation, loadingLocation } = prevState

            //console.log(`receivedPath('${nextLocation.pathname}')`)
            //console.log(`    displayedLocation=${displayedLocation && displayedLocation.pathname}   loadingLocation=${loadingLocation && loadingLocation.pathname}`)

            if (typeof displayedLocation !== 'undefined') {
                const locationChanged = !locationsAreEqual(
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
            prevProps: IAsyncRouterProps<TOnReadyArgs>,
            prevState: IAsyncRouterState<TOnReadyArgs>
        ) {
            const {
                location,
                getLocationKey,
                onNavigationDone,
                onNavigationStart,
                onReady
            } = this.props
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

            const pathChanged =
                typeof prevLocation !== 'undefined' &&
                location.pathname !== prevLocation.pathname

            const locationKeyChanged =
                getLocationKey(location) !== getLocationKey(prevLocation)

            if (!navigationInProgress && pathChanged && locationKeyChanged) {
                // normal navigation start
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
                    loadingLocation: undefined
                })

                return
            }

            if (loadingLocation && location.pathname === displayedLocation.pathname) {
                // We got redirected to the page we're already on
                onNavigationDone()

                this.setState(s => ({
                    ...s,
                    loadingLocation: undefined,
                    navigationInProgress: false
                }))

                return
            }
        }

        onReady = (location: Location, args: TOnReadyArgs) => {
            const { onNavigationDone, onReady } = this.props
            const { loadingLocation, displayedLocationIsReady } = this.state

            //console.log(`onReady(${location && location.pathname})`)

            //console.log({
            //    displayedLocationIsReady,
            //    loadingLocation: loadingLocation ? loadingLocation.pathname : undefined,
            //    locationsAreEqual: loadingLocation ? locationsAreEqual(location, loadingLocation) : undefined,
            //})

            if (
                displayedLocationIsReady &&
                (!loadingLocation || !locationsAreEqual(location, loadingLocation))
            ) {
                // ignore any unexpected calls to onReady.
                // if the user begins navigation to one page, but then interrupts the navigation by clicking
                // on a link, we can still get an onReady call from the first page. This call must be ignored,
                // or else weirdness will occur.

                //console.log('Ignoring unexpected call to onReady')
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
                loadingLocation.pathname !== displayedLocation.pathname
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
