﻿import * as React from 'react';
import { Route} from 'react-router-dom';
import { Location } from 'history';
import { IRoutesProps, passPageProps, CustomLoadable } from 'Components/Routing/RouteProps';

const List = CustomLoadable(() => import('./List').then(m => m.Page))
const Detail = CustomLoadable(() => import('./List').then(m => m.Page))

export class Routes extends React.Component<IRoutesProps, {}> {
    render() {
        const { location, ...pageProps } = this.props

        const ppp = passPageProps(pageProps)

        return [
            <Route exact path="/product/list" render={ppp(List)} location={location} key="ProductList" />,
            <Route exact path="/product/detail" render={ppp(Detail)} location={location} key="Product" />,
        ]
    }
}