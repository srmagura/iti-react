import React from 'react'
import {
    RoutesProps,
    LocalRoutesProps,
    passPageProps,
} from 'Components/Routing/RouteProps'
import { getProtectedRouteBuilder } from 'Components/Routing/ProtectedRoute'

const Form = React.lazy(() => import('./Form/Form'))
const Components = React.lazy(() => import('./Components/Components'))
const Inputs = React.lazy(() => import('./Inputs/Inputs'))
const RouteParam = React.lazy(() => import('./RouteParam'))
const RedirectingPage = React.lazy(() => import('./RedirectingPage'))
const TabManager = React.lazy(() => import('./TabManager/TabManager'))
const UrlSearchParam = React.lazy(() => import('./UrlSearchParam'))
const Hooks = React.lazy(() => import('./Hooks'))
const SpamOnReady = React.lazy(() => import('./SpamOnReady'))
const Permissions = React.lazy(() => import('./Permissions'))

export const paths = {
    routeParam: '/test/routeParam/:number',
}

export function getTestRoutes(props: RoutesProps) {
    const { location, computedMatch, ...pageProps } = props as LocalRoutesProps

    const ppp = passPageProps(pageProps)
    const protectedRoute = getProtectedRouteBuilder(location, computedMatch)

    return [
        protectedRoute('/test/form', ppp(Form)),
        protectedRoute('/test/components', ppp(Components)),
        protectedRoute('/test/inputs', ppp(Inputs)),
        protectedRoute(paths.routeParam, ppp(RouteParam)),
        protectedRoute('/test/redirectingPage', ppp(RedirectingPage)),
        protectedRoute('/test/tabManager', ppp(TabManager)),
        protectedRoute('/test/urlSearchParam', ppp(UrlSearchParam)),
        protectedRoute('/test/hooks', ppp(Hooks)),
        protectedRoute('/test/spamOnReady', ppp(SpamOnReady)),
        protectedRoute('/test/permissions', ppp(Permissions)),
    ]
}
