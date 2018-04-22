import * as React from 'react';
import { ProductDto } from 'Models';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { IPageProps } from 'Components/RouteProps';

interface IPageState {
    product?: ProductDto
}

export class _Page extends React.Component<IPageProps & RouteComponentProps<any>, IPageState> {

    state: IPageState = {
    }

    ajaxRequest?: JQuery.jqXHR

    async componentDidMount() {
        const { match, onReady } = this.props

        const id = match.params.id
        const product = await (this.ajaxRequest = $.getJSON('api/Product/Get?id=' + id)) as ProductDto

        this.setState({ product })
        onReady({ title: product.name })
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
            this.ajaxRequest.abort()
    }
}

export const Page = withRouter(_Page)