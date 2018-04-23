import * as React from 'react';
import { IPageProps } from 'Components/RouteProps';
import { NavbarLink } from 'Components/Header';

interface IPageState {

}

export class Page extends React.Component<IPageProps, IPageState> {

    componentDidMount() {
        const { onReady } = this.props

        onReady({
            title: 'Index',
            activeNavbarLink: NavbarLink.Index,
            pageId: 'page-home-index'
        })
    }

    render() {
        if (!this.props.ready) return null

        return  <h3>Index</h3>
    }
}