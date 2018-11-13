import * as React from 'react'

interface FooterProps extends React.Props<any> {}

export function Footer(props: FooterProps) {
    return (
        <div className="footer">
            <div className="container">
                <span>
                    &copy; {new Date().getFullYear()} Interface Technologies, Inc. All
                    rights reserved.
                </span>
            </div>
        </div>
    )
}
