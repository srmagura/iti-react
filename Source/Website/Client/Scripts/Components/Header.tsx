import * as React from 'react';
import { AsyncLink } from 'Components/AsyncLink';

export enum NavbarLink {
    Index, Products
}

function linkClass(active: boolean) {
    let className = 'nav-link '

    if (active)
        className += 'active'

    return className
}

interface IHeaderProps extends React.Props<any> {
    activeNavbarLink: NavbarLink
}

export function Header(props: IHeaderProps): JSX.Element {
    const { activeNavbarLink } = props

    return <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="#">React SPA template</a>
        <button className="navbar-toggler" type="button"
            data-toggle="collapse"
            data-target="#navbar-supported-content"
            aria-controls="navbar-supported-content"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbar-supported-content">
            <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <AsyncLink to="/"
                        className={linkClass(activeNavbarLink == NavbarLink.Index)}>
                        Index
                    </AsyncLink>
                </li>
                <li className="nav-item">
                    <AsyncLink to="/home/productlist"
                        className={linkClass(activeNavbarLink == NavbarLink.Products)}>
                        Products
                    </AsyncLink>
                </li>
            </ul>
        </div>
    </nav>
}
