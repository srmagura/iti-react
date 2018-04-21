import * as React from 'react';
import { Title } from 'Components/Title';
import { ProductDto } from 'Models';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface IPageState {
    products: ProductDto[]
}

class _Page extends React.Component<RouteComponentProps<any>, IPageState> {

    state = {
        products: []
    }

    async componentDidMount() {
        const response = await fetch('api/Product/List')
        const products = await response.json() as ProductDto[]

        this.setState({products})
    }

    rowClick = (product: ProductDto) => {
        const { history } = this.props
        history.push('/home/product/' + product.id)
    }

    render() {
        const { products } = this.state

        return <Title title="Products">
            <h3>Products</h3>
            <table className="table table-hover">
                <thead className="thead-light">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p =>
                        <tr key={p.id} onClick={() => this.rowClick(p)}>
                            <td>{p.id}</td>
                            <td>{p.name}</td>
                        </tr>)}
                </tbody>
                </table>
        </Title>
    }
}

export const Page = withRouter(_Page)