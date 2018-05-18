import * as React from 'react';
import { IPageProps } from 'Components/Routing/RouteProps';
import { NavbarLink } from 'Components/Header';
import { api } from 'Api';
import { Link } from 'react-router-dom';

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
            await api.product.internalServerError({})
        } catch (e) {
            onError(e)
        }
    }

    render() {
        if (!this.props.ready) return null

        return <div>
            <h3>Index</h3>         
            <ul>
                <li>
                    <Link to="/home/form">
                        Form test
                </Link>
                </li>
                <li>
                    <Link to="/home/inputs">
                        Input test
                        </Link>
                </li>
                <li>
                    <Link to="/home/components">
                        Component test
                    </Link>
                </li>
                <li>
                    <a href="javascript:void(0)" onClick={this.testError}>
                        Click to receive InternalServerError from API
                    </a>
                </li>
            </ul>
        </div>
    }
}