import * as React from 'react';
import { ProductDto } from 'Models';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { IPageProps } from 'Components/RouteProps';
import { api, CancellablePromise } from 'Api';
import { NavbarLink } from 'Components/Header';

interface IPageState {
    product?: ProductDto
}

export class _Page extends React.Component<IPageProps & RouteComponentProps<any>, IPageState> {

    state: IPageState = {
    }

    ajaxRequest?: CancellablePromise<any>

    async componentDidMount() {
        const { match, onReady, onError } = this.props

        const id = match.params.id as number
        let product

        try {
            product = await (this.ajaxRequest = api.product.get(id))
        } catch (e) {
            onError(e)
        }

        this.setState({ product })
        onReady({
            title: product.name,
            activeNavbarLink: NavbarLink.Products,
            pageId: 'page-home-product'
        })
    }

    render() {
        if (!this.props.ready) return null

        const { product } = this.state

        if (!product)
            return null

        return <div>
            <h3>{product.name}</h3>
            <p>ID: {product.id}</p>
        </div>
    }

    componentWillUnmount() {
        if (this.ajaxRequest)
            this.ajaxRequest.cancel()
    }
}

export const Page = withRouter(_Page)