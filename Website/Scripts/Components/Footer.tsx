import * as React from 'react';

interface IFooterProps extends React.Props<any> {
}

export function Footer(props: IFooterProps) {
    return (
        <div className="container">
                <h3>&copy; {(new Date()).getFullYear()} Interface Technologies, Inc. All rights reserved.</h3>
        </div>
    )
}