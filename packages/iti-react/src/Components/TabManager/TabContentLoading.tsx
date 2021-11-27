import React, { useState, useEffect, useContext } from 'react'
import { ItiReactContext } from '../../ItiReactContext'

const delayMs = 200

export interface TabContentLoadingProps {
    renderLoadingIndicator?(): React.ReactNode
}

/**
 * The component that is displayed while a tab is loading in [[`TabManager`]].
 */
export function TabContentLoading(props: TabContentLoadingProps): React.ReactElement {
    const [pastDelay, setPastDelay] = useState(false)

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setPastDelay(true)
        }, delayMs)

        return (): void => {
            window.clearTimeout(timer)
        }
    }, [])

    const itiReactContextData = useContext(ItiReactContext)
    const renderLoadingIndicator =
        props.renderLoadingIndicator ?? itiReactContextData.renderLoadingIndicator

    // We're doing this weird thing with two LoadingIcons so that
    // - the height of the component doesn't change when pastDelay becomes true
    // - the real LoadingIcon's fadeIn animation doesn't play while it is invisible

    return (
        <div className="tab-content-loading">
            <div className={pastDelay ? 'd-none' : 'invisible'}>
                {renderLoadingIndicator()}
            </div>
            <div className={pastDelay ? '' : 'd-none'}>{renderLoadingIndicator()}</div>
        </div>
    )
}
