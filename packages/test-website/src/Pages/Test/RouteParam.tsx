import React from 'react'
import { Link } from 'react-router-dom'
import { PageProps } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components'

interface PageState {}

export default class Page extends React.Component<PageProps, PageState> {
    componentDidMount() {
        const { onReady } = this.props

        onReady({
            title: 'URL Param Test',
            activeNavbarLink: NavbarLink.Index,
        })
    }

    render() {
        if (!this.props.ready) return null

        const { match } = this.props
        const number = parseInt(match.params.number)

        return (
            <div>
                <h1>Route Param Test</h1>
                <p>
                    The loading bar should not show when clicking the + button, because
                    getLocationKey('/test/routeParam/x') = '/test/routeparam'.
                </p>
                <p>
                    <strong>URL param:</strong> {number}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Link
                        className="btn btn-primary"
                        to={`/test/routeParam/${number + 1}`}
                    >
                        +
                    </Link>
                </p>
            </div>
        )
    }
}
