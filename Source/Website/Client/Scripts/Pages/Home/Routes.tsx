﻿import * as React from 'react';
import { Route} from 'react-router-dom';
import { Location } from 'history';
import { IRoutesProps, passPageProps, CustomLoadable } from 'Components/Routing/RouteProps';

// No dynamic import for Error page since we want it to work even if we lose internet
import { Page as Error } from './Error';

const Index = CustomLoadable(() => import('./Index').then(m => m.Page))
const Form = CustomLoadable(() => import('./Form').then(m => m.Page))
const Components = CustomLoadable(() => import('./Components').then(m => m.Page))
const Inputs = CustomLoadable(() => import('./Inputs').then(m => m.Page))
const UrlParam = CustomLoadable(() => import('./UrlParam').then(m => m.Page))

export class Routes extends React.Component<IRoutesProps, {}> {
    render() {
        const { location, ...pageProps } = this.props

        const ppp = passPageProps(pageProps)

        return [
            <Route exact path="/" render={ppp(Index)} location={location} key="Index" />,
            <Route exact path="/home/form" render={ppp(Form)} location={location} key="Form" />,
            <Route exact path="/home/components" render={ppp(Components)} location={location} key="Components" />,
            <Route exact path="/home/inputs" render={ppp(Inputs)} location={location} key="Inputs" />,
            <Route exact path="/home/urlParam/:number" render={ppp(UrlParam)} location={location} key="UrlParam" />,
            <Route exact path="/home/error" render={ppp(Error)} location={location} key="Error" />,
        ]
    }
}
