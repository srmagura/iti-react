import * as React from 'react'

interface TabContentProps {
    onReady(): void
    loadImmediately?: boolean
}

interface TabContentState {
    dataLoaded: boolean
}

export class TabContent extends React.Component<TabContentProps, TabContentState> {
    static defaultProps: Pick<TabContentProps, 'loadImmediately'> = {
        loadImmediately: false
    }

    state: TabContentState = { dataLoaded: false }
    timer?: number

    componentDidMount() {
        // repeatedly call onReady to test that onChildReady does not execute callback
        // if readiness not actually changed
        this.timer = window.setInterval(
            () => {
                this.setState({
                    dataLoaded: true
                })

                this.props.onReady()
            },
            !this.props.loadImmediately ? 2000 : 0
        )
    }

    componentWillUnmount() {
        window.clearInterval(this.timer)
    }

    render() {
        return (
            <div>
                <h1>{this.props.children}</h1>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                </p>
            </div>
        )
    }
}
