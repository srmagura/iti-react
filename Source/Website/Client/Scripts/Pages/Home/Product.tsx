import * as React from 'react';
import { Title } from 'Components/Title';
import { ProductDto } from 'Models';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface IPageState {
    product?: ProductDto
}

export class _Page extends React.Component<RouteComponentProps<any>, IPageState> {

    state: IPageState = {
    }

    async componentDidMount() {
        const { match } = this.props
        const id = match.params.id
        const response = await fetch('api/Product/Get?id=' + id)
        const product = await response.json() as ProductDto

        this.setState({product})
    }

    render() {
        const { product } = this.state

        if (!product)
            return null

        return <Title title={product.name}>
            <h3>{product.name}</h3>
            <p>ID: {product.id}</p>
        </Title>
    }
}

export const Page = withRouter(_Page)