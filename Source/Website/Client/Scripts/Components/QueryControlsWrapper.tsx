﻿import * as React from 'react';

interface IQueryControlsWrapperProps extends React.Props<any> {
    title?: string
    maxHeight: number
    defaultOpen?: boolean
}

interface IQueryControlsWrapperState {
    open: boolean
}

export class QueryControlsWrapper extends React.Component<IQueryControlsWrapperProps, IQueryControlsWrapperState> {

    static defaultProps: Partial<IQueryControlsWrapperProps> = {
        defaultOpen: true
    }

    constructor(props: IQueryControlsWrapperProps) {
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

        return <div className="query-controls-wrapper">
            <a className="expand-link" href="javascript:void(0)" onClick={this.toggleVisibility}>
                <i className={`fas ${chevron}`} />{' ' + title}
            </a>
            <div className={`query-controls-content ${open ? '' : 'closed'}`}
                style={contentStyle}>
                <div className="query-controls-inner">
                    {children}
                </div>
            </div>
        </div>
    }
}