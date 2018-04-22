import * as React from 'react';
import { ProductDto } from 'Models';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { IPageProps } from 'Components/RouteProps';

interface IPageState {
    products: ProductDto[]
}

class _Page extends React.Component<IPageProps & RouteComponentProps<any>, IPageState> {

    state = {
        products: []
    }

    async componentDidMount() {
        const { onReady } = this.props

        const response = await fetch('api/Product/List')
        const products = await response.json() as ProductDto[]

        this.setState({ products })
        onReady({title: 'Products'})
    }

    rowClick = (product: ProductDto) => {
        const { history } = this.props
        history.push('/home/product/' + product.id)
    }

    render() {
        if (!this.props.ready) return null

        const { products } = this.state

        return <div>
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
        </div>
    }
}

export const Page = withRouter(_Page)