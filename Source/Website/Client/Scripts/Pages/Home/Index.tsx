import * as React from 'react';
import { IPageProps } from 'Components/RouteProps';
import { NavbarLink } from 'Components/Header';
import { AsyncLink } from 'Components/AsyncLink';
import { api } from 'Api';

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

    testError = async () => {
        const { onError } = this.props

        try {
            await api.product.internalServerError()
        } catch (e) {
            onError(e)
        }
    }

    render() {
        if (!this.props.ready) return null

        return <div>
            <h3>Index</h3>
            <button onClick={this.testError}>
                Click to receive InternalServerError from API
                </button>
            <p>
                <AsyncLink to="/home/form">
                    Form example
                </AsyncLink>
                </p>
            </div>
    }
}