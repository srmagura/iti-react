import * as React from 'react';
import { Route } from 'react-router-dom';

import { Page as Index } from './Index';
import { Page as ProductList } from './ProductList';
import { Page as Product } from './Product';

export class Routes extends React.Component<{}, {}> {
    render() {
        return [
            <Route exact path="/" component={Index} key="Index" />,
            <Route exact path="/home/productlist" component={ProductList} key="ProductList" />,
            <Route exact path="/home/product/:id" component={Product} key="Product" />,
        ]
    }
}
