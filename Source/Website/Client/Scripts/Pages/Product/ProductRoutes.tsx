import * as React from 'react'
import { Location } from 'history'
import {
    RoutesProps,
    LocalRoutesProps,
    passPageProps,
    CustomLoadable
} from 'Components/Routing/RouteProps'
import { getProtectedRouteBuilder } from 'Components/Routing/ProtectedRoute'

const List = CustomLoadable(() => import('./List').then(m => m.Page))
const Detail = CustomLoadable(() => import('./Detail').then(m => m.Page))

export function getProductRoutes(props: RoutesProps) {
    const { location, computedMatch, ...pageProps } = props as LocalRoutesProps

    const ppp = passPageProps(pageProps)
    const protectedRoute = getProtectedRouteBuilder(location, computedMatch)

    return [
        protectedRoute('/product/list', ppp(List)),
        protectedRoute('/product/detail/:id', ppp(Detail))
    ]
}
