import * as React from 'react'
import { IRoutesProps } from 'Components/Routing/RouteProps'
import { Routes as HomeRoutes } from 'Pages/Home/Routes'
import { Routes as ProductRoutes } from 'Pages/Product/Routes'

export class Routes extends React.Component<IRoutesProps, {}> {
    render() {
        const props = this.props

        return [
            <HomeRoutes {...props} key="Home" />,
            <ProductRoutes {...props} key="Product" />
        ]
    }
}
