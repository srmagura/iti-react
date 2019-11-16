import React from 'react'
import { ItiReactContext } from '../..'

interface TabContentLoadingProps {
    renderLoadingIndicator?(): React.ReactNode
}

interface TabContentLoadingState {
    pastDelay: boolean
}

export class TabContentLoading extends React.Component<
    TabContentLoadingProps,
    TabContentLoadingState
> {
    state: TabContentLoadingState = {
        pastDelay: false
    }

    readonly delayMs = 200
    timer?: number

    componentDidMount() {
        this.timer = window.setTimeout(() => {
            this.setState({ pastDelay: true })
        }, this.delayMs)
    }

    render() {
        const { pastDelay } = this.state

        // We're doing this weird thing with two LoadingIcons so that
        // - the height of the component doesn't change when pastDelay becomes true
        // - the real LoadingIcon's fadeIn animation doesn't play while it is invisible

        return (
            <ItiReactContext.Consumer>
                {data => {
                    // If no render prop was supplied, fallback to the context's renderLoadingIndicator
                    const renderLoadingIndicator = this.props.renderLoadingIndicator
                        ? this.props.renderLoadingIndicator
                        : data.renderLoadingIndicator

                    return (
                        <div className="tab-content-loading">
                            <div className={pastDelay ? 'd-none' : 'invisible'}>
                                {renderLoadingIndicator()}
                            </div>
                            <div className={pastDelay ? '' : 'd-none'}>
                                {renderLoadingIndicator()}
                            </div>
                        </div>
                    )
                }}
            </ItiReactContext.Consumer>
        )
    }

    componentWillUnmount() {
        window.clearTimeout(this.timer)
    }
}
