import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

interface LoadingIconProps {
    className?: string
}

export function LoadingIcon({ className = '' }: LoadingIconProps): React.ReactElement {
    return (
        <FontAwesomeIcon icon={faSpinner} className={`loading-icon ${className}`} spin />
    )
}
