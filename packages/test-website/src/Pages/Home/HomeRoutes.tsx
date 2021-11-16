import React from 'react'
import {
    RoutesProps,
    LocalRoutesProps,
    passPageProps,
} from 'Components/Routing/RouteProps'
import {
    getProtectedRouteBuilder,
    getUnprotectedRouteBuilder,
} from 'Components/Routing/ProtectedRoute'

// No dynamic import for Error page since we want it to work even if we lose internet
import Error from './Error'

const Index = React.lazy(() => import('./Index'))
const LogIn = React.lazy(() => import('./LogIn'))

export function getHomeRoutes(props: RoutesProps) {
    const { location, computedMatch, ...pageProps } = props as LocalRoutesProps

    const ppp = passPageProps(pageProps)
    const protectedRoute = getProtectedRouteBuilder(location, computedMatch)
    const unprotectedRoute = getUnprotectedRouteBuilder(location, computedMatch)

    return [
        protectedRoute('/home/index', ppp(Index)),
        unprotectedRoute('/home/error', ppp(Error)),
        unprotectedRoute('/home/logIn', ppp(LogIn)),
    ]
}
