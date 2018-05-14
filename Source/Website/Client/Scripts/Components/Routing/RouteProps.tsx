import * as React from 'react';
const Loadable = require('react-loadable');
import { RouteComponentProps } from 'react-router-dom';
import { History, Location } from 'history';
import { NavbarLink } from 'Components/Header';
import { ErrorDto } from 'Models';

export interface IOnReadyArgs {
    pageId: string
    activeNavbarLink?: NavbarLink
    title: string
}

export interface IRoutesProps extends React.Props<any> {
    history: History
    location: Location

    ready: boolean
    onError(error: any): void
    onReady(args: IOnReadyArgs): void
}

export interface IPagePropsCore extends React.Props<any> {
    history: History

    ready: boolean
    error?: ErrorDto
    onError(error: any): void
    onReady(args: IOnReadyArgs): void
}

export type IPageProps = RouteComponentProps<any> & IPagePropsCore

export function passPageProps(props: IPagePropsCore) {
    return (PageComponent: React.ComponentClass<IPageProps> | React.StatelessComponent<IPageProps>) =>
        (routeComponentProps: RouteComponentProps<any>) => <PageComponent {...props} {...routeComponentProps} />
}

export function CustomLoadable<Props>(loader: () => Promise<React.ComponentType<Props>>) {
    return Loadable({
        loader,
        loading: () => null
    })
}