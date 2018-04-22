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

    async componentDidMount() {
        const { match, onReady } = this.props

        const id = match.params.id
        const response = await fetch('api/Product/Get?id=' + id)
        const product = await response.json() as ProductDto

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
}

export const Page = withRouter(_Page)