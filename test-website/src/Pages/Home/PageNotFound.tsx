import React from 'react'
import { ErrorDto } from 'Models'
import { PageProps } from 'Components/Routing/RouteProps'
import { Redirect } from 'react-router'

export class Page extends React.Component<PageProps, {}> {
    componentDidMount() {
        const { onReady } = this.props

        onReady({
            title: 'Page does not exist',
            activeNavbarLink: undefined
        })
    }

    render() {
        if (!this.props.ready) return null

        return (
            <div className="alert alert-info" role="alert">
                The page you requested does not exist.
            </div>
        )
    }
}
