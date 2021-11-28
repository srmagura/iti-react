import React, { PropsWithChildren } from 'react'

/**
 * Displays a dollar sign at the beginning of a text input.
 */
export function MoneyInputContainer({
    children,
}: PropsWithChildren<unknown>): React.ReactElement {
    return (
        <div className="money-input-container">
            <div className="dollar-sign">$</div>
            {children}
        </div>
    )
}
