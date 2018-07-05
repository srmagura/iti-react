import * as React from 'react'
import { Route } from 'react-router-dom'
import { Location } from 'history'
import {
    IRoutesProps,
    passPageProps,
    CustomLoadable
} from 'Components/Routing/RouteProps'

const List = CustomLoadable(() => import('./List').then(m => m.Page))
const Detail = CustomLoadable(() => import('./Detail').then(m => m.Page))

export function getProductRoutes(props: IRoutesProps) {
    const { location, ...pageProps } = props

    const ppp = passPageProps(pageProps)

    return [
        <Route
            exact
            path="/product/list"
            render={ppp(List)}
            location={location}
            key="List"
        />,
        <Route
            exact
            path="/product/detail/:id"
            render={ppp(Detail)}
            location={location}
            key="Detail"
        />
    ]
}
