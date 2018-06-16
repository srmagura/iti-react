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
} from 'iti-react'

interface IPageState {
    shouldRedirect: boolean
}

/* This is to test that the page titles update correctly when a page pushes to history
 * in componentDidMount(), like a log out page would. */
export class Page extends React.Component<IPageProps, IPageState> {
    state: IPageState = {
        shouldRedirect: false
    }

    componentDidMount() {
        const { onReady } = this.props

        onReady({
            title: 'SHOULD NOT BE VISIBLE',
            activeNavbarLink: NavbarLink.Index,
            pageId: 'page-home-redirectingpage'
        })

        this.setState({ shouldRedirect: true })
    }

    componentDidUpdate() {
        const { history } = this.props
        const { shouldRedirect } = this.state

        if (shouldRedirect) {
            this.setState({ shouldRedirect: false })
            history.push('/')
        }
    }

    render() {
        return null
    }
}
