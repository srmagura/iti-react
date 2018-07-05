import * as React from 'react'
import {
    IRoutesProps,
    CustomLoadable,
    passPageProps
} from 'Components/Routing/RouteProps'
import { getHomeRoutes } from 'Pages/Home/HomeRoutes'
import { getProductRoutes } from 'Pages/Product/ProductRoutes'
import { Switch, Route } from 'react-router-dom'

const PageNotFound = CustomLoadable(() =>
    import('Pages/Home/PageNotFound').then(m => m.Page)
)

export class Routes extends React.Component<IRoutesProps, {}> {
    render() {
        const { location, urlLocation, ...pageProps } = this.props
        const props = this.props

        const ppp = passPageProps(pageProps)

        return (
            <Switch location={location}>
                {getHomeRoutes(props)}
                {getProductRoutes(props)}
                <Route render={ppp(PageNotFound)} location={location} />*
            </Switch>
        )
    }
}
