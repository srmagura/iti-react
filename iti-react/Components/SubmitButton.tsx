﻿import * as React from 'react'
import { ItiReactContext } from '../ItiReactContext'

interface SubmitButtonProps extends React.DetailedHTMLProps<any, any> {
    element?: 'button' | 'a'
    submitting: boolean

    // Enable/disable the onClick event without changing the button style
    onClickEnabled?: boolean

    // Enable/disable the onClick event and change the button style.
    // If provided, overrides the value of onClickEnabled.
    enabled?: boolean
}

interface SubmitButtonCoreProps extends SubmitButtonProps {
    renderLoadingIndicator: () => React.ReactNode
}

/* Submit button/link that displays a loading indicator and disables the onClick handler
 * when submitting=true. */
function SubmitButtonCore(props: SubmitButtonCoreProps) {
    let {
        submitting,
        children,
        onClick,
        onClickEnabled,
        enabled,
        element,
        className,
        renderLoadingIndicator,
        ...passThroughProps
    } = props

    // Default values
    if (!element) element = 'button'
    if (typeof enabled === 'undefined') enabled = true
    if (typeof onClickEnabled === 'undefined') onClickEnabled = true

    if (submitting || !enabled) {
        onClickEnabled = false
    }

    if (!onClickEnabled) {
        onClick = undefined
    }

    if (typeof className === 'undefined') {
        className = ''
    }

    className += ' submit-button'
    if (!enabled) {
        className += ' disabled'
    }

    if (element === 'button') {
        return (
            <button {...passThroughProps} className={className} onClick={onClick}>
                {submitting ? <span className="hidden-label">{children}</span> : children}
                {submitting && (
                    <div className="loading-icon-container">
                        {renderLoadingIndicator()}
                    </div>
                )}
            </button>
        )
    } else {
        return (
            <a
                {...passThroughProps}
                role="button"
                className={className}
                href="javascript:void(0)"
                onClick={onClick}
            >
                {children}
                {submitting && <span> {renderLoadingIndicator()}</span>}
            </a>
        )
    }
}

export function SubmitButton(props: SubmitButtonProps) {
    return (
        <ItiReactContext.Consumer>
            {data => (
                <SubmitButtonCore
                    {...props}
                    renderLoadingIndicator={data.renderLoadingIndicator}
                />
            )}
        </ItiReactContext.Consumer>
    )
}
