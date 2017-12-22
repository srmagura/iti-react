import * as React from 'react';

interface IHeaderProps extends React.Props<any> {
}

export function Header(props: IHeaderProps): JSX.Element {

    return (
        <nav id="header">
            <div className="container">
                <h3>React Template</h3>
            </div>
        </nav>
    )
}