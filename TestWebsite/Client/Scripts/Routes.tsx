import * as React from 'react'
import { RoutesProps, CustomLoadable, passPageProps } from 'Components/Routing/RouteProps'
import { getHomeRoutes } from 'Pages/Home/HomeRoutes'
import { getProductRoutes } from 'Pages/Product/ProductRoutes'
import { getTestRoutes } from 'Pages/Test/TestRoutes'
import {
    Switch,
    Route,
    Redirect,
    withRouter,
    RouteComponentProps
} from 'react-router-dom'
import { History, Location, locationsAreEqual } from 'history'
import { NoWarnRedirect } from '@interface-technologies/iti-react'

const PageNotFound = CustomLoadable(() =>
    import('Pages/Home/PageNotFound').then(m => m.Page)
)

export function Routes(props: RoutesProps) {
    const { location, ...pageProps } = props

    const ppp = passPageProps(pageProps)

    return (
        <Switch location={location}>
            {/* You can create a component that renders routes, but it also need to render PageNotFound. */}
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
