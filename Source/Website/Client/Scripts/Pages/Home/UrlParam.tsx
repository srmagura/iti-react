import * as React from 'react'
import { Link } from 'react-router-dom'

import { IPageProps } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components/Header'
import {
    SubmitButton,
    Pager,
    ActionDialog,
    confirm,
    ConfirmDialog
} from '@interface-technologies/iti-react'

interface IPageState {}

export class Page extends React.Component<IPageProps, IPageState> {
    componentDidMount() {
        const { onReady } = this.props

        onReady({
            title: 'URL Param Test',
            activeNavbarLink: NavbarLink.Index,
            pageId: 'page-home-urlparam'
        })
    }

    render() {
        if (!this.props.ready) return null

        const { match } = this.props
        const number = parseInt(match.params.number)

        return (
            <div>
                <h1>URL Param Test</h1>
                <p>
                    The loading bar should not show when clicking the + button,
                    because getLocationKey('/home/urlParam/x') = /home/urlparam.
                </p>
                <p>
                    <strong>URL param:</strong> {number}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Link
                        className="btn btn-primary"
                        to={`/home/urlParam/${number + 1}`}
                    >
                        +
                    </Link>
                </p>
            </div>
        )
    }
}
