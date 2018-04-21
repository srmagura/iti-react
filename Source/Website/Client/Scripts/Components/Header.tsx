import * as React from 'react';

interface IHeaderProps extends React.Props<any> {
}

export function Header(props: IHeaderProps): JSX.Element {

    return (
        <nav id="header">
            <div className="container">
                <h2>React Template</h2>
            </div>
        </nav>
    )
}