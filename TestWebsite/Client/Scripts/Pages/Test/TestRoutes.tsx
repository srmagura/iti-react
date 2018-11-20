﻿import * as React from 'react'
import {
    RoutesProps,
    LocalRoutesProps,
    passPageProps,
    CustomLoadable
} from 'Components/Routing/RouteProps'
import {
    getProtectedRouteBuilder,
    getUnprotectedRouteBuilder
} from 'Components/Routing/ProtectedRoute'

const Form = CustomLoadable(() => import('./Form').then(m => m.Page))
const Components = CustomLoadable(() => import('./Components').then(m => m.Page))
const Inputs = CustomLoadable(() => import('./Inputs/Inputs').then(m => m.Page))
const UrlParam = CustomLoadable(() => import('./UrlParam').then(m => m.Page))
const RedirectingPage = CustomLoadable(() =>
    import('./RedirectingPage').then(m => m.Page)
)
const CancellablePromise = CustomLoadable(() =>
    import('./CancellablePromise').then(m => m.Page)
)
const TabManager = CustomLoadable(() => import('./TabManager').then(m => m.Page))

export const paths = {
    urlParam: '/test/urlParam/:number'
}

export function getTestRoutes(props: RoutesProps) {
    const { location, computedMatch, ...pageProps } = props as LocalRoutesProps

    const ppp = passPageProps(pageProps)
    const protectedRoute = getProtectedRouteBuilder(location, computedMatch)

    return [
        protectedRoute('/test/form', ppp(Form)),
        protectedRoute('/test/components', ppp(Components)),
        protectedRoute('/test/inputs', ppp(Inputs)),
        protectedRoute(paths.urlParam, ppp(UrlParam)),
        protectedRoute('/test/redirectingPage', ppp(RedirectingPage)),
        protectedRoute('/test/cancellablePromise', ppp(CancellablePromise)),
        protectedRoute('/test/tabManager', ppp(TabManager))
    ]
}
