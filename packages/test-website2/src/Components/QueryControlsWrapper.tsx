import React from 'react'

interface QueryControlsWrapperProps {
    className?: string
}

export function QueryControlsWrapper({
    className,
    children,
}: React.PropsWithChildren<QueryControlsWrapperProps>): React.ReactElement {
    const classes = ['query-controls']
    if (className) classes.push(className)

    return <div className={classes.join(' ')}>{children}</div>
}
