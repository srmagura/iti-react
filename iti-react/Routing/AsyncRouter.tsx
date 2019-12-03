import React from 'react'
import { useEffect, useState } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Location } from 'history'
import { areLocationsEqualIgnoringKey } from '../Util'
import { usePrevious } from '@interface-technologies/iti-react-core'

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

/* Test cases:
 *
 * 1. Normal navigation
 * 2. Double click a link - navigation should still occur like normal
 * 3. Click a link and press browser back button while page is loading
 * 4. Click a link and then click a different link while page is loading
 * 5. Go to the "Spam onReady" page in test-website and follow the steps
 * 6. Redirect to self: click the ITI logo in test-website while on /home/index.
 *    The logo is a link to /. When the path is /, a redirect to /home/index is
 *    rendered, putting you back where you started.
 */

interface AsyncRouterProps<TOnReadyArgs> extends RouteComponentProps<any> {
    renderRoutes(args: {
        location: Location
        key: string
        ready: boolean
        onReady(args: TOnReadyArgs): void
    }): React.ReactNode

    renderLayout(children: React.ReactNode[]): React.ReactElement
    getLocationKey(location: Location): string

    onNavigationStart(): void
    onNavigationDone(): void
    onReady(args: TOnReadyArgs): void
}

function _getAsyncRouter<TOnReadyArgs>(): React.SFC<AsyncRouterProps<TOnReadyArgs>> {
    return function AsyncRouter(props: AsyncRouterProps<TOnReadyArgs>) {
        const { renderRoutes, renderLayout, getLocationKey, location } = props

        const [displayedLocation, setDisplayedLocation] = useState<Location>(location)
        const [loadingLocation, setLoadingLocation] = useState<Location>()
        const [initialLocationCalledOnReady, setInitialLocationCalledOnReady] = useState(
            false
        )

        // default to true since initial page is loading
        const [navigationInProgress, setNavigationInProgress] = useState(true)

        useEffect(() => {
            if (typeof displayedLocation !== 'undefined') {
                const locationChanged = !areLocationsEqualIgnoringKey(
                    displayedLocation,
                    location
                )

                const locationKeyChanged =
                    getLocationKey(displayedLocation) !== getLocationKey(location)

                if (locationChanged) {
                    if (locationKeyChanged) {
                        setLoadingLocation(location)
                    } else {
                        // Should not reload page when location key is the same - this is the whole
                        // point of location keys
                        setDisplayedLocation(location)
                    }
                }
            }
        })

        function onNavigationStart() {
            setNavigationInProgress(true)

            props.onNavigationStart()
        }

        function onNavigationDone() {
            setNavigationInProgress(false)
            setLoadingLocation(undefined)

            window.scrollTo(0, 0)
            props.onNavigationDone()
        }

        const prevLocation = usePrevious<Location>(location)

        useEffect(() => {
            if (
                !navigationInProgress &&
                prevLocation &&
                getLocationKey(location) !== getLocationKey(prevLocation)
            ) {
                // normal navigation start
                onNavigationStart()
            }
        })

        useEffect(() => {
            if (
                loadingLocation &&
                getLocationKey(location) === getLocationKey(displayedLocation)
            ) {
                // We got redirected to the page we're already on
                onNavigationDone()
            }
        })

        function onReady(location: Location, args: TOnReadyArgs) {
            const isForLoadingLocation =
                loadingLocation && areLocationsEqualIgnoringKey(location, loadingLocation)

            // ignore any unexpected calls to onReady.
            // if the user begins navigation to one page, but then interrupts the navigation by clicking
            // on a link, we can still get an onReady call from the first page. This call must be ignored,
            // or else weirdness will occur.
            //
            // this can also happen when a page calls onReady multiple times, for example, the page calls
            // onReady every time a query completes. Calling onReady multiple times is harmless, and as such,
            // no warning should be displayed.
            if (isForLoadingLocation || !initialLocationCalledOnReady) {
                // normal navigation done
                setDisplayedLocation(location)
                setInitialLocationCalledOnReady(true)

                onNavigationDone()
                props.onReady(args)
            }
        }

        const pages = [
            renderRoutes({
                location: displayedLocation,
                key: getLocationKey(displayedLocation),
                ready: initialLocationCalledOnReady,
                onReady: args => onReady(displayedLocation, args)
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
                    onReady: args => onReady(loadingLocation, args)
                })
            )
        }

        return renderLayout(pages)
    }
}

export function getAsyncRouter<TOnReadyArgs>() {
    return withRouter(_getAsyncRouter<TOnReadyArgs>())
}
