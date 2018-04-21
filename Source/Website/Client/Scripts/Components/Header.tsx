import * as React from 'react';
import { NavLink } from 'react-router-dom';

interface IHeaderProps extends React.Props<any> {
}

export function Header(props: IHeaderProps): JSX.Element {

    return (
        <nav id="header">
            <div className="container">
                <h2>React Template</h2>
                <NavLink to="/">Index</NavLink>
                <NavLink to="/page1">Page 1</NavLink>
                <NavLink to="/page2">Page 2</NavLink>
            </div>
        </nav>
    )
}