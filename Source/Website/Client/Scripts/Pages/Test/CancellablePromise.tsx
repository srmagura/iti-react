import * as React from 'react'

import { IPageProps } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components/Header'
import {
    SubmitButton,
    Pager,
    ActionDialog,
    confirm,
    ConfirmDialog
} from '@interface-technologies/iti-react'

export class Page extends React.Component<IPageProps> {
    componentDidMount() {
        const { onReady } = this.props

        onReady({
            title: 'Cancellable promise test',
            activeNavbarLink: NavbarLink.Index,
            pageId: 'page-test-cancellablepromise'
        })
    }

    render() {
        if (!this.props.ready) return null

        return (
            <div>
                <h1>Cancellable Promise Test</h1>
            </div>
        )
    }
}
