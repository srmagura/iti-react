﻿import * as $ from 'jquery'
import * as React from 'react'
import * as moment from 'moment'
import { sortBy } from 'lodash'
import { ProductDto } from 'Models'
import { RouteComponentProps } from 'react-router-dom'
import { PageProps } from 'Components/Routing/RouteProps'
import {
    CancellablePromise,
    AutoRefreshUpdater,
    DataUpdater,
    Pager,
    getTdLink
} from '@interface-technologies/iti-react'
import { api } from 'Api'
import { NavbarLink } from 'Components/Header'
import { QueryControlsWrapper } from 'Components/QueryControlsWrapper'
import { isCancelledQuery } from 'Components/ProcessError'

interface IFilters {
    name: string
}

interface QueryParams {
    filters: IFilters
    page: number
}

interface QueryResult {
    products: ProductDto[]
    totalPages: number
}

interface QueryControlsProps {
    queryParams: QueryParams
    onQueryParamsChange(queryParams: QueryParams): void
    resetQueryParams(): void
}

function QueryControls(props: QueryControlsProps) {
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

    return (
        <QueryControlsWrapper title="Filters" maxHeight={120}>
            <div className="filter-row">
                <div className="filter-section">
                    <div className="title">Name</div>
                    <div>
                        <input
                            className="form-control"
                            value={filters.name}
                            onChange={e =>
                                onFiltersChange({
                                    name: e.currentTarget.value
                                })
                            }
                        />
                    </div>
                </div>
                <div className="filter-section">
                    <div className="title">&nbsp;</div>
                    <div>
                        <button className="btn btn-secondary" onClick={resetQueryParams}>
                            Reset filters
                        </button>
                    </div>
                </div>
            </div>
        </QueryControlsWrapper>
    )
}

interface PageState {
    products: ProductDto[]
    totalPages: number
    queryParams: QueryParams
    loading: boolean
    lastAutoRefreshFailed: boolean
}

export class Page extends React.Component<PageProps, PageState> {
    static defaultQueryParams: QueryParams = {
        filters: {
            name: ''
        },
        page: 1
    }

    static pageSize = 10

    state: PageState = {
        products: [],
        totalPages: 1,
        queryParams: Page.defaultQueryParams,
        loading: false,
        lastAutoRefreshFailed: false
    }

    autoRefreshUpdater: AutoRefreshUpdater<QueryParams>

    constructor(props: PageProps) {
        super(props)

        const dataUpdater = new DataUpdater<QueryParams, QueryResult>({
            getCurrentQueryParams: () => this.state.queryParams,
            query: this.query,
            onLoadingChange: loading => this.setState({ loading }),
            onResultReceived: this.onQueryResultReceived,
            onError: this.onQueryError
        })

        this.autoRefreshUpdater = new AutoRefreshUpdater({
            dataUpdater,
            refreshInterval: moment.duration(10, 'seconds'),
            onRefreshingChange: () => {},
            onError: this.onQueryError
        })
    }

    async componentDidMount() {
        this.autoRefreshUpdater.startAutoRefresh()
    }

    query = (queryParams: QueryParams) => {
        const flt = queryParams.filters

        return api.product.list({
            name: flt.name,
            page: queryParams.page,
            pageSize: Page.pageSize
        })
    }

    onQueryError = (e: any) => {
        this.setState({ lastAutoRefreshFailed: true })
    }

    onQueryResultReceived = (result: QueryResult) => {
        const { ready, onReady } = this.props

        if (!ready) {
            onReady({
                title: 'Products',
                activeNavbarLink: NavbarLink.Products,
                pageId: 'page-product-list'
            })
        }
        // TODO:SAM prevent nonexistent page

        this.setState({
            ...result,
            lastAutoRefreshFailed: false
        })
    }

    onQueryParamsChange = (newQueryParams: QueryParams, shouldDebounce: boolean) => {
        const { queryParams } = this.state

        const getJson = (qp: QueryParams) => JSON.stringify(qp.filters)
        const json = getJson(queryParams)
        const newJson = getJson(newQueryParams)

        if (json !== newJson) {
            newQueryParams = { ...newQueryParams, page: 1 }
        }

        this.setState({ queryParams: newQueryParams })

        this.autoRefreshUpdater.handleQueryParamsChange(newQueryParams, shouldDebounce)
    }

    render() {
        if (!this.props.ready) return null

        const {
            products,
            queryParams,
            lastAutoRefreshFailed,
            totalPages,
            loading
        } = this.state

        return (
            <div>
                <p>This serves as a test of DataUpdater and AutoRefreshUpdater.</p>
                <h3>Products</h3>
                {lastAutoRefreshFailed && (
                    <div className="alert alert-danger" role="alert">
                        Auto refresh failed.
                    </div>
                )}
                <QueryControls
                    queryParams={queryParams}
                    onQueryParamsChange={queryParams =>
                        this.onQueryParamsChange(queryParams, true)
                    }
                    resetQueryParams={() =>
                        this.onQueryParamsChange(Page.defaultQueryParams, false)
                    }
                />
                {loading && <h5 className="text-primary">LOADING</h5>}
                <table className="table table-hover table-td-link">
                    <thead className="thead-light">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => {
                            const Td = getTdLink('/product/detail/' + p.id)

                            return (
                                <tr key={p.id}>
                                    <Td>{p.id}</Td>
                                    <Td>{p.name}</Td>
                                    <Td>{p.stock}</Td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <Pager
                    page={queryParams.page}
                    totalPages={totalPages}
                    onPageChange={page =>
                        this.onQueryParamsChange(
                            {
                                ...queryParams,
                                page
                            },
                            false
                        )
                    }
                />
            </div>
        )
    }

    componentWillUnmount() {
        this.autoRefreshUpdater.dispose()
    }
}
