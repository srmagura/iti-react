import * as React from 'react';
import { Route} from 'react-router-dom';
import { Location } from 'history';
import { IRoutesProps, passPageProps } from 'Components/RouteProps';

import { Page as Index } from './Index';
import { Page as ProductList } from './ProductList';
import { Page as Product } from './Product';
import { Page as Error } from './Error';

export class Routes extends React.Component<IRoutesProps, {}> {
    render() {
        const { location, ...pageProps } = this.props

        const ppp = passPageProps(pageProps)

        return [
            <Route exact path="/" render={ppp(Index)} location={location} key="Index" />,
            <Route exact path="/home/productlist" render={ppp(ProductList)} location={location} key="ProductList" />,
            <Route exact path="/home/product/:id" render={ppp(Product)} location={location} key="Product" />,
            <Route exact path="/home/error" render={ppp(Error)} location={location} key="Error" />,
        ]
    }
}
