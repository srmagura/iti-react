import * as React from 'react'
import { PageProps } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components'
import { api } from 'Api'
import { Link } from 'react-router-dom'

interface PageState {}

export class Page extends React.Component<PageProps, PageState> {
    componentDidMount() {
        const { onReady } = this.props

        onReady({
            title: 'Index',
            activeNavbarLink: NavbarLink.Index
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
                        <Link to="/test/tabManager">Tab test</Link>
                    </li>
                    <li>
                        <Link to="/test/hooks">Hooks test</Link>
                    </li>
                    <li>
                        <Link to="/test/urlSearchParam?myParam=0">
                            URL search param test
                        </Link>
                    </li>
                    <li>
                        <Link to="/test/routeParam/0">Route param test</Link>
                    </li>
                    <li>
                        <Link to="/test/redirectingPage">Redirecting page test</Link> -
                        make sure page titles update correctly
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
