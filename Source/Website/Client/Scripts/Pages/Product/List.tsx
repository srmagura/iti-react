import * as $ from 'jquery';
import * as React from 'react';
import * as moment from 'moment';
import { ProductDto } from 'Models';
import { RouteComponentProps } from 'react-router-dom';
import { IPageProps } from 'Components/Routing/RouteProps';
import { ICancellablePromise, AutoRefreshUpdater, DataUpdater } from 'Util/ITIReact';
import { api } from 'Api';
import { NavbarLink } from 'Components/Header';
import { QueryControlsWrapper } from 'Components/QueryControlsWrapper';
import { isCancelledQuery } from 'Components/ProcessError';

interface IFilters {
    name: string
}

interface IQueryParams {
    filters: IFilters
    page: number
}

interface IQueryResult {
    products: ProductDto[]
    totalPages: number
}

interface IQueryControlsProps extends React.Props<any> {
    queryParams: IQueryParams
    onQueryParamsChange(queryParams: IQueryParams): void
    resetQueryParams(): void
}

function QueryControls(props: IQueryControlsProps) {
    const { queryParams, onQueryParamsChange, resetQueryParams } = props

    const filters = queryParams.filters
    function onFiltersChange(changedFilters: Partial<IFilters>) {
        onQueryParamsChange({
            ...queryParams,
            filters: {
                ...queryParams.filters,
                ...changedFilters
            }
        })
    }

    return <QueryControlsWrapper title="Filters" maxHeight={120}>
        <div className="filter-row">
            <div className="filter-section">
                <div className="title">Name</div>
                <div>
                    <input className="form-control"
                        value={filters.name}
                        onChange={e => onFiltersChange({
                            name: e.currentTarget.value
                        })} />
                </div>
            </div>
            <div className="filter-section">
                <div className="title">&nbsp;</div>
                <div>
                    <button className="btn btn-secondary"
                        onClick={resetQueryParams}>
                        Reset filters
                        </button>
                </div>
            </div>
        </div>
    </QueryControlsWrapper>
}


interface IPageState {
    products: ProductDto[],
    totalPages: number
    queryParams: IQueryParams
    loading: boolean
}

export class Page extends React.Component<IPageProps, IPageState> {

    static defaultQueryParams: IQueryParams = {
        filters: {
            name: ''
        },
        page: 1
    }

    state: IPageState = {
        products: [],
        totalPages: 1,
        queryParams: Page.defaultQueryParams,
        loading: false,
    }

    autoRefreshUpdater: AutoRefreshUpdater<IQueryParams, IQueryResult>

    constructor(props: IPageProps) {
        super(props)

        const dataUpdater = new DataUpdater<IQueryParams, IQueryResult>({
            getCurrentQueryParams: () => this.state.queryParams,
            query: this.query,
            onLoadingChange: loading => this.setState({ loading }),
            onResultReceived: this.onQueryResultReceived,
            onError: this.onQueryError,
            isCancelledQuery
        })

        this.autoRefreshUpdater = new AutoRefreshUpdater({
            dataUpdater,
            refreshInterval: moment.duration(10, 'seconds'),
            onRefreshingChange: () => { },
            onError: this.onQueryError
        })
    }

    async componentDidMount() {
        this.autoRefreshUpdater.startAutoRefresh()
    }

    query = (queryParams: IQueryParams) => {
        return api.product.list({})
    }

    onQueryError = (e: any) => {
        // TODO
    }

    onQueryResultReceived = (result: IQueryResult) => {
        const { ready, onReady } = this.props

        if (!ready) {
            onReady({
                title: 'Products',
                activeNavbarLink: NavbarLink.Products,
                pageId: 'page-product-list'
            })
        }

        this.setState(result)
    }

    rowClick = (product: ProductDto) => {
        this.props.history.push('/product/detail/' + product.id)
    }

    render() {
        if (!this.props.ready) return null

        const { products, queryParams } = this.state

        return <div>
            <p>This serves as a test of DataUpdater and AutoRefreshUpdater.</p>
            <h3>Products</h3>
            <QueryControls
                queryParams={queryParams}
                onQueryParamsChange={() => { }}
                resetQueryParams={() => { }} />
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