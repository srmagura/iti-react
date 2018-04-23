import * as React from 'react';
import { Location } from 'history';
import { NavbarLink } from 'Components/Header';
import { ErrorDto } from 'Models';

export interface IOnReadyArgs {
    pageId: string
    activeNavbarLink?: NavbarLink
    title: string
}

export interface IRoutesProps extends React.Props<any> {
    location: Location
    ready: boolean
    onError(error: any): void
    onReady(args: IOnReadyArgs): void
    onNavigationStart(path: string): void
}

export interface IPageProps extends React.Props<any> {
    ready: boolean
    error?: ErrorDto
    onError(error: any): void
    onReady(args: IOnReadyArgs): void
    onNavigationStart(path: string): void
}

export function passPageProps<TProps = IPageProps>(props: TProps) {
    return (PageComponent: React.ComponentClass<TProps>) =>
        () => <PageComponent {...props} />
}
