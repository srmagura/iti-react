import * as React from 'react'
import { Link } from 'react-router-dom'

import { PageProps } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components'
import {
    SubmitButton,
    Pager,
    ActionDialog,
    confirm,
    ConfirmDialog
} from '@interface-technologies/iti-react'

interface PageState {
    shouldRedirect: boolean
}

/* This is to test that the page titles update correctly when a page pushes to history
 * in componentDidMount(), like a log out page would. */
export class Page extends React.Component<PageProps, PageState> {
    state: PageState = {
        shouldRedirect: false
    }

    componentDidMount() {
        const { onReady } = this.props

        onReady({
            title: 'SHOULD NOT BE VISIBLE',
            activeNavbarLink: NavbarLink.Index,
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
