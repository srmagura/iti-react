import * as React from 'react'
const Loadable = require('react-loadable')
import { RouteComponentProps } from 'react-router-dom'
import { History, Location } from 'history'
import { NavbarLink } from 'Components/Header'
import { IError } from 'Components/ProcessError'

export interface IOnReadyArgs {
    pageId: string
    activeNavbarLink?: NavbarLink
    title: string
}

export interface RoutesProps {
    location: Location

    ready: boolean
    error?: IError
    onError(error: any): void
    onReady(args: IOnReadyArgs): void
}

export interface LocalRoutesProps extends RoutesProps {
    computedMatch: any
}

export interface PagePropsCore {
    ready: boolean
    error?: IError
    onError(error: any): void
    onReady(args: IOnReadyArgs): void
}

export type PageProps = RouteComponentProps<any> & PagePropsCore

export function passPageProps(props: PagePropsCore) {
    return (
        PageComponent:
            | React.ComponentClass<PageProps>
            | React.StatelessComponent<PageProps>
    ) => (routeComponentProps: RouteComponentProps<any>) => (
        <PageComponent {...props} {...routeComponentProps} />
    )
}
