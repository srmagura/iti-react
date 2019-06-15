import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Location } from 'history'
import { NavbarLink } from 'Components'
import { IError } from 'Components/ProcessError'

export interface IOnReadyArgs {
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
