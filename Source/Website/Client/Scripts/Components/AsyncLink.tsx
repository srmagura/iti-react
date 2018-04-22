import * as React from 'react';
import { RouteContext } from 'Components/AsyncRouter';

interface IAsyncLinkProps extends React.Props<any> {
    to: string
    className?: string
}

export function AsyncLink(props: IAsyncLinkProps) {
    const { to, children, className } = props

    return <RouteContext.Consumer>
        {({ onNavigationStart }) =>
            <a href="javascript:void(0)"
                onClick={() => onNavigationStart(to)}
                className={className}>
                { children }
                </a>
        }
    </RouteContext.Consumer>
}