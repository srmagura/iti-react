import * as React from 'react';
import { IPageProps } from 'Components/RouteProps';

interface IPageState {

}

export class Page extends React.Component<IPageProps, IPageState> {

    componentDidMount() {
        const { onReady } = this.props

        onReady({ title: 'Index' })
    }

    render() {
        if (!this.props.ready) return null

        return  <h3>Index</h3>
    }
}