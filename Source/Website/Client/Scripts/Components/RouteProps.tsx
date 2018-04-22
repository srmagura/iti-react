import * as React from 'react';
import { Location } from 'history';

export interface IOnReadyArgs {
    title: string
}

export interface IRoutesProps extends React.Props<any> {
    location: Location
    ready: boolean
    onReady(args: IOnReadyArgs): void
    onNavigationStart(path: string): void
}

export interface IPageProps extends React.Props<any> {
    ready: boolean
    onReady(args: IOnReadyArgs): void
    onNavigationStart(path: string): void
}

export function passPageProps<TProps = IPageProps>(props: TProps) {
    return (PageComponent: React.ComponentClass<TProps>) =>
        () => <PageComponent {...props} />
}
