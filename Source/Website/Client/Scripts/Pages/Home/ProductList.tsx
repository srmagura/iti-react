import * as React from 'react';
import { Title } from 'Components/Title';
import { ProductDto } from 'Models';


interface IPageState {
    products: ProductDto[]
}

export class Page extends React.Component<{}, IPageState> {

    state = {
        products: []
    }

    async componentDidMount() {
        const response = await fetch('Product/List')
        const products = await response.json() as ProductDto[]

        this.setState({products})
    }

    render() {
        const { products } = this.state

        return <Title title="Products">
            <h3>Products</h3>
            <table className="table">
                <thead className="thead-light">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p =>
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.name}</td>
                        </tr>)}
                </tbody>
            </table>
        </Title>
    }
}