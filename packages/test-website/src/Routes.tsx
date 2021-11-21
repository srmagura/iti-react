﻿import React, { Suspense } from 'react'
import { RoutesProps, passPageProps } from 'Components/Routing/RouteProps'
import { getHomeRoutes } from 'Pages/Home/HomeRoutes'
import { getProductRoutes } from 'Pages/Product/ProductRoutes'
import { getTestRoutes } from 'Pages/Test/TestRoutes'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useSelector, useDispatch, Omit } from 'react-redux'
import { errorSelector, errorActions } from '_Redux'
import { UrlParamName } from 'Components'

import Error from 'Pages/Home/Error'
const PageNotFound = React.lazy(() => import('Pages/Home/PageNotFound'))

export function Routes(props: Omit<RoutesProps, 'onError'>) {
    const { location, ...incompletePageProps } = props

    const dispatch = useDispatch()
    const onError = (e: any) => dispatch(errorActions.onError(e))

    const pageProps = { ...incompletePageProps, onError }
    const routesProps = { ...props, onError }

    const error = useSelector(errorSelector)
    const urlSearchParams = new URLSearchParams(location.search)

    if (urlSearchParams.has(UrlParamName.Error) && error) {
        return (
            <Route
                render={(routeProps) => (
                    <Error error={error} {...routeProps} {...pageProps} />
                )}
            />
        )
    }

    const ppp = passPageProps(pageProps)

    return (
        <Suspense fallback={null}>
            <Switch location={location}>
                {getHomeRoutes(routesProps)}
                {getProductRoutes(routesProps)}
                {getTestRoutes(routesProps)}
                <Route
                    exact
                    path="/"
                    render={() => <Redirect to="/home/index" push={false} />}
                />
                <Route render={ppp(PageNotFound)} />
            </Switch>
        </Suspense>
    )
}