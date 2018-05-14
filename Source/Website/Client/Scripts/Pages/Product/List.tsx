import * as $ from 'jquery';
import * as React from 'react';
import { ProductDto } from 'Models';
import { RouteComponentProps } from 'react-router-dom';
import { IPageProps } from 'Components/Routing/RouteProps';
import { ICancellablePromise, api } from 'Api';
import { NavbarLink } from 'Components/Header';

interface IPageState {
    products: ProductDto[],
}

export class Page extends React.Component<IPageProps, IPageState> {

    state: IPageState = {
        products: [],
    }

    ajaxRequest?: ICancellablePromise<any>

    async componentDidMount() {
        const { onReady, onError } = this.props

        try {
            const products = await (this.ajaxRequest = api.product.list())
            this.setState({ products })
        } catch (e) {
            onError(e)
        }

        onReady({
            title: 'Products',
            activeNavbarLink: NavbarLink.Products,
            pageId: 'page-home-productlist'
        })
    }

    rowClick = (product: ProductDto) => {
        this.props.history.push('/home/product/' + product.id)
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
                    {/* TODO TD LINK */}
                    {products.map(p =>
                        <tr key={p.id} onClick={() => this.rowClick(p)}>
                            <td>{p.id}</td>
                            <td>{p.name}</td>
                        </tr>)}
                </tbody>
            </table>
        </div>
    }

    componentWillUnmount() {
        if (this.ajaxRequest) 
            this.ajaxRequest.cancel()
    }
}