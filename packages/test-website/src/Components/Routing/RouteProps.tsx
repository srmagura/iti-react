import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Location } from 'history'
import { NavbarLink } from 'Components'
import { IError } from '_Redux'

export interface OnReadyArgs {
    activeNavbarLink?: NavbarLink
    title: string
}

export interface RoutesProps {
    location: Location

    ready: boolean
    onError(error: any): void
    onReady(args: OnReadyArgs): void
}

export interface LocalRoutesProps extends RoutesProps {
    computedMatch: any
}

export interface PagePropsCore {
    ready: boolean
    onError(error: any): void
    onReady(args: OnReadyArgs): void
}

export type PageProps = RouteComponentProps<any> & PagePropsCore

export function passPageProps(props: PagePropsCore) {
    return (
            PageComponent:
                | React.ComponentClass<PageProps>
                | React.StatelessComponent<PageProps>
        ) =>
        (routeComponentProps: RouteComponentProps<any>) =>
            <PageComponent {...props} {...routeComponentProps} />
}
