﻿import React from 'react'
import {
    RoutesProps,
    LocalRoutesProps,
    passPageProps,
} from 'Components/Routing/RouteProps'
import { getProtectedRouteBuilder } from 'Components/Routing/ProtectedRoute'

const List = React.lazy(() => import('./List'))
const Detail = React.lazy(() => import('./Detail'))

export function getProductRoutes(props: RoutesProps) {
    const { location, computedMatch, ...pageProps } = props as LocalRoutesProps

    const ppp = passPageProps(pageProps)
    const protectedRoute = getProtectedRouteBuilder(location, computedMatch)

    return [
        protectedRoute('/product/list', ppp(List)),
        protectedRoute('/product/detail/:id', ppp(Detail)),
    ]
}