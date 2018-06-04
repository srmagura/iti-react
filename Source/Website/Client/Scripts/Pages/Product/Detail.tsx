import * as React from 'react'
import { ProductDto } from 'Models'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { IPageProps } from 'Components/Routing/RouteProps'
import { api } from 'Api'
import { NavbarLink } from 'Components/Header'
import { ICancellablePromise } from 'Util/ITIReact'

interface IPageState {
    product?: ProductDto
}

export class _Page extends React.Component<
    IPageProps & RouteComponentProps<any>,
    IPageState
> {
    state: IPageState = {}

    ajaxRequest?: ICancellablePromise<any>

    async componentDidMount() {
        const { match, onReady, onError } = this.props

        const id = match.params.id as number

        try {
            const product = await (this.ajaxRequest = api.product.get({ id }))

            this.setState({ product })

            onReady({
                title: product.name,
                activeNavbarLink: NavbarLink.Products,
                pageId: 'page-home-product'
            })
        } catch (e) {
            onError(e)
        }
    }

    render() {
        if (!this.props.ready) return null

        const { product } = this.state

        if (!product) return null

        return (
            <div>
                <h3>{product.name}</h3>
                <p>ID: {product.id}</p>
            </div>
        )
    }

    componentWillUnmount() {
        if (this.ajaxRequest) this.ajaxRequest.cancel()
    }
}

export const Page = withRouter(_Page)
