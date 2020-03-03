﻿import React from 'react'
import { ItiReactContext } from '../ItiReactContext'
import { LinkButton } from './LinkButton'
import { defaults } from 'lodash'

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
    /* eslint-disable prefer-const */
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
    } = defaults({ ...props }, { element: 'button', enabled: true, onClickEnabled: true })
    /* eslint-enable prefer-const */

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

    if (element === 'button') {
        // if submitting or !onClickEnabled, set type to 'button' to prevent
        // buttons with type="submit" submitting the form
        const type = onClickEnabled && !submitting ? passThroughProps.type : 'button'

        return (
            <button
                {...passThroughProps}
                className={className}
                onClick={onClick}
                type={type}
                disabled={!enabled}
            >
                {submitting ? <span className="hidden-label">{children}</span> : children}
                {submitting && (
                    <div className="loading-icon-container">
                        {renderLoadingIndicator()}
                    </div>
                )}
            </button>
        )
    } else {
        if (enabled) {
            return (
                <LinkButton {...passThroughProps} className={className} onClick={onClick}>
                    {children}
                    {submitting && <span> {renderLoadingIndicator()}</span>}
                </LinkButton>
            )
        } else {
            className += ' disabled-link'

            return (
                <span {...passThroughProps} className={className}>
                    {children}
                </span>
            )
        }
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
