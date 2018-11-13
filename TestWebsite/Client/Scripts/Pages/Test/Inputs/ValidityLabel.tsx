import * as React from 'react'

interface ValidityLabelProps extends React.Props<any> {
    valid?: boolean
}

export function ValidityLabel(props: ValidityLabelProps) {
    return <span className="validity-label">{props.valid ? 'VALID' : 'INVALID'}</span>
}
