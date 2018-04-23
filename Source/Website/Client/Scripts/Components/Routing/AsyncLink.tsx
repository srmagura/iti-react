import * as React from 'react';
import { RouteContext, IRouteContextData } from 'Components/Routing/AsyncRouter';

interface IAsyncLinkProps extends React.Props<any> {
    to: string
    className?: string
}

export function AsyncLink(props: IAsyncLinkProps) {
    const { to, children, className } = props

    return <RouteContext.Consumer>
        {(data?: IRouteContextData) => {
            if (!data) return null

            return <a href="javascript:void(0)"
                onClick={() => data.onNavigationStart(to)}
                className={className}>
                {children}
            </a>
        }}
    </RouteContext.Consumer>
}