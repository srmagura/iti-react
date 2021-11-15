import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Location } from 'history'
import { usePrevious } from '@interface-technologies/iti-react-core'
import { areLocationsEqualIgnoringKey } from '../Util'
import { cleanupImproperlyClosedDialog } from '../Components'

export interface AsyncRouterProps<TOnReadyArgs> {
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

    /**
     * A callback that is executed the first time onReady is called. This is a
     * convenience for hiding the loading screen.
     */
    onInitialPageReady(): void
}

/**
 * A component factory that returns an `AsyncRouter`. When using `AsyncRouter` and
 * a link changes the route, the new page is mounted but not displayed until it has
 * finished loading data and calls `onReady`. A progress bar at the top of the page
 * (usually NProgress) indicates to the user that the new page is loading.
 * 
 * It is fine if a page calls `onReady` multiple times.
 * 
 * Example:
 * ```
 * export interface OnReadyArgs {
 *     title: string
 * }
 * 
 * const AsyncRouter = getAsyncRouter<OnReadyArgs>()

 * export function MyAsyncRouter(): React.ReactElement {
 *     const dispatch = useDispatch()
 * 
 *     const onReady = useCallback(
 *         ({ title }: OnReadyArgs): void => {
 *             const _window = window as unknown as WindowWithGlobals
 *             if (_window.loadingScreen) {
 *                 _window.loadingScreen.finish(false, _window.onLoadingScreenHidden)
 *                 _window.loadingScreen = undefined
 *             }
 * 
 *             updateTitle(title)
 *         },
 *         []
 *     )
 * 
 *     return (
 *         <AsyncRouter
 *             renderRoutes={(args) => <Routes {...args} />}
 *             renderLayout={(children) => (
 *                 <Layout>
 *                     {children}
 *                 </Layout>
 *             )}
 *             getLocationKey={getLocationKey}
 *             onNavigationStart={() => NProgress.start()}
 *             onNavigationDone={() => NProgress.done()}
 *             onReady={onReady}
 *         />
 *     )
 * }
 * 
 * function getLocationKey(location: Location): string {
 *     const locationMatchesPath = (p: string): boolean =>
 *         !!matchPath(location.pathname, {
 *             path: p,
 *             exact: true,
 *         })
 * 
 *     if (locationMatchesPath(jobPaths.jobBoard)) return '/job/board'
 * 
 *     return location.pathname.toLowerCase()
 * }
 * ```
 *  
 * ### `getLocationKey`
 *
 * - If you want to be able to change the route parameters without the page
 *   unmounting and remounting, you should implement `getLocationKey`,
 *   so that the page has the same location key regardless of the route
 *   params.
 *
 *   Example: you want to be able to navigate from `/job/0` to `/job/1`
 *   without the page remounting. You should make `getLocationKey` return
 *   `'/job'` for any path that matches `'/job/:page?`. Use `matchPath`
 *   for this.
 *
 *   LocationKey is NOT the same as the `key` property of the `location` object.
 *
 * - When implementing `getLocationKey`, if the current path does not correspond to
 *   a route in your application, you must return the current path without any modifications.
 *
 *   Consider this example to see why you must return the path unmodified. Say you have a route
 *   `/job/:page?` and you have implemented `getLocationKey` to return `'/job'` for any
 *   path that starts with `/job`. The user enters `/job/bogus/path/here` into the URL bar.
 *   The "Page not found" page will be rendered. Then the user clicks the navbar link to the job list.
 *   The location key does not change when the location changes, so `AsyncRouter` does not unmount the
 *   previous page and mount the new page. But the two pages are actually different! So yeah
 *   weird stuff can happen if you implement `getLocationKey` like this. Always use `matchPath` in
 *   `getLocationKey`!
 *
 * ### Test Cases
 *
 * 1. Normal navigation.
 * 2. Double click a link - navigation should still occur like normal.
 * 3. Click a link and press browser back button while page is loading.
 * 4. Click a link and then click a different link while page is loading.
 * 5. Go to the "Spam onReady" page in `test-website` and follow the steps.
 * 6. Redirect to self: click the ITI logo in `test-website` while on `/home/index`.
 *    The logo is a link to `/`. When the path is `/`, a redirect to `/home/index` is
 *    rendered, putting you back where you started.
 *    
 * @typeParam TOnReadyArgs the arguments your pages will pass to `onReady`
 */
export function getAsyncRouter<TOnReadyArgs>(): React.FunctionComponent<
    AsyncRouterProps<TOnReadyArgs>
> {
    return function AsyncRouter(
        props: AsyncRouterProps<TOnReadyArgs>
    ): React.ReactElement {
        const { renderRoutes, renderLayout, getLocationKey, onInitialPageReady } = props
        const location = useLocation()

        const [displayedLocation, setDisplayedLocation] = useState<Location>(location)
        const [loadingLocation, setLoadingLocation] = useState<Location>()
        const [initialLocationCalledOnReady, setInitialLocationCalledOnReady] =
            useState(false)

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
        }, [displayedLocation, location, getLocationKey])

        function onNavigationStart(): void {
            setNavigationInProgress(true)

            props.onNavigationStart()
        }

        function onNavigationDone(): void {
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

        const isInitialLoadRef = useRef(true)

        function onReady(location: Location, args: TOnReadyArgs): void {
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

                // Necessary to support dialogs that have links
                cleanupImproperlyClosedDialog()

                props.onReady(args)

                if (isInitialLoadRef.current) {
                    isInitialLoadRef.current = false
                    onInitialPageReady()
                }
            }
        }

        const pages = [
            renderRoutes({
                location: displayedLocation,
                key: getLocationKey(displayedLocation),
                ready: initialLocationCalledOnReady,
                onReady: (args) => onReady(displayedLocation, args),
            }),
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
                    onReady: (args) => onReady(loadingLocation, args),
                })
            )
        }

        return renderLayout(pages)
    }
}
