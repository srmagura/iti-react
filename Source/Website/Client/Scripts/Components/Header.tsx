﻿import * as React from 'react';
import { NavLink } from 'react-router-dom';

interface IHeaderProps extends React.Props<any> {
}

export function Header(props: IHeaderProps): JSX.Element {
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
                    <NavLink className="nav-link" to="/" exact>Index</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/page1">Page 1</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/page2">Page 2</NavLink>
                </li>
            </ul>
        </div>
    </nav>
}
