import * as React from 'react';
import { IRoutesProps } from 'Components/RouteProps';
import { Routes as HomeRoutes } from 'Pages/Home/Routes';

export class Routes extends React.Component<IRoutesProps, {}> {
    render() {
        const props = this.props

        return [
            <HomeRoutes {...props} key="Home" />
        ]
    }
}