import * as React from 'react'
import { IPageProps } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components/Header'
import { api } from 'Api'
import { Link } from 'react-router-dom'

interface IPageState {}

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

        return (
            <div>
                <h3>Index</h3>
                <ul>
                    <li>
                        <Link to="/test/form">Form test</Link>
                    </li>
                    <li>
                        <Link to="/test/inputs">Input test</Link>
                    </li>
                    <li>
                        <Link to="/test/components">Component test</Link>
                    </li>
                    <li>
                        <Link to="/test/urlParam/0">URL param test</Link>
                    </li>
                    <li>
                        <Link to="/test/redirectingPage">Redirecting page test</Link> -
                        make sure page titles update correctly
                    </li>
                    <li>
                        <Link to="/test/tabLayout">Tab layout test</Link>
                    </li>
                    <li>
                        <a href="javascript:void(0)" onClick={this.testError}>
                            Click to receive InternalServerError from API
                        </a>
                    </li>
                </ul>
            </div>
        )
    }
}
