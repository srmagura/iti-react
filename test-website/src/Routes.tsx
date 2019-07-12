import * as React from 'react'
import { RoutesProps, passPageProps } from 'Components/Routing/RouteProps'
import { getHomeRoutes } from 'Pages/Home/HomeRoutes'
import { getProductRoutes } from 'Pages/Product/ProductRoutes'
import { getTestRoutes } from 'Pages/Test/TestRoutes'
import { Switch, Route } from 'react-router-dom'
import { NoWarnRedirect, CustomLoadable } from '@interface-technologies/iti-react'
import { useSelector } from 'react-redux'
import { errorSelector } from '_Redux'
import { UrlParamName } from 'Components'

import { Page as Error } from 'Pages/Home/Error'
const PageNotFound = CustomLoadable(() =>
    import('Pages/Home/PageNotFound').then(m => m.Page)
)

export function Routes(props: RoutesProps) {
    const { location, ...pageProps } = props
    const error = useSelector(errorSelector)

    const urlSearchParams = new URLSearchParams(location.search)

    if (urlSearchParams.has(UrlParamName.Error) && error) {
        return (
            <Route
                render={routeProps => (
                    <Error error={error} {...routeProps} {...pageProps} />
                )}
            />
        )
    }

    const ppp = passPageProps(pageProps)

    return (
        <Switch location={location}>
            {getHomeRoutes(props)}
            {getProductRoutes(props)}
            {getTestRoutes(props)}
            <Route
                exact
                path="/"
                render={() => <NoWarnRedirect to="/home/index" push={false} />}
            />
            <Route render={ppp(PageNotFound)} />
        </Switch>
    )
}
