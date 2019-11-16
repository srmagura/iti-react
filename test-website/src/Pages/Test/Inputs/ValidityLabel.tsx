import React from 'react'

interface ValidityLabelProps {
    valid?: boolean
}

export function ValidityLabel(props: ValidityLabelProps) {
    return <span className="validity-label">{props.valid ? 'VALID' : 'INVALID'}</span>
}
