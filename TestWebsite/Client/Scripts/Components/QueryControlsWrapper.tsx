import * as React from 'react'

interface QueryControlsWrapperProps {
    title?: string
    maxHeight: number
    defaultOpen?: boolean
}

interface QueryControlsWrapperState {
    open: boolean
}

export class QueryControlsWrapper extends React.Component<
    QueryControlsWrapperProps,
    QueryControlsWrapperState
> {
    static defaultProps: Partial<QueryControlsWrapperProps> = {
        defaultOpen: true
    }

    constructor(props: QueryControlsWrapperProps) {
        super(props)

        this.state = {
            open: props.defaultOpen!
        }
    }

    toggleVisibility = () => {
        const { open } = this.state
        this.setState({ open: !open })
    }

    render() {
        const { title, children, maxHeight } = this.props
        const { open } = this.state

        const chevron = open ? 'fa-chevron-down' : 'fa-chevron-right'

        let contentStyle = {}
        // slide effect disabled currently
        //if (open) {
        //    contentStyle = { maxHeight }
        //}

        return (
            <div className="query-controls-wrapper">
                <a
                    className="expand-link"
                    href="javascript:void(0)"
                    onClick={this.toggleVisibility}
                >
                    <i className={`fas ${chevron}`} />
                    {' ' + title}
                </a>
                <div
                    className={`query-controls-content ${open ? '' : 'closed'}`}
                    style={contentStyle}
                >
                    <div className="query-controls-inner">{children}</div>
                </div>
            </div>
        )
    }
}
