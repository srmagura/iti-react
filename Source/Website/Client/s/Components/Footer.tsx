import * as React from 'react';

interface IFooterProps extends React.Props<any> {
}

export function Footer(props: IFooterProps) {
    return (
        <div className="container">
            <div className="footer">
                <span>&copy; {(new Date()).getFullYear()} Interface Technologies, Inc. All rights reserved.</span>
            </div>
        </div>
    )
}