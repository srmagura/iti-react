﻿import * as React from 'react'
import * as moment from 'moment'
import { ProductDto } from 'Models'
import { PageProps } from 'Components/Routing/RouteProps'
import {
    AutoRefreshUpdater,
    DataUpdater,
    Pager,
    getTdLink,
    CancellablePromise
} from '@interface-technologies/iti-react'
import { api } from 'Api'
import { NavbarLink } from 'Components/Header'
import { QueryControlsWrapper } from 'Components/QueryControlsWrapper'

// Not a typical QueryParams type, just testing that DataUpdater handles undefined correctly
type QueryParams =
    | {
          name: string
          page: number
      }
    | undefined

const defaultQueryParams: QueryParams = {
    name: '',
    page: 1
}

type QueryResult =
    | {
          products: ProductDto[]
          totalPages: number
      }
    | undefined

interface QueryControlsProps {
    queryParams: QueryParams
    onQueryParamsChange(queryParams: QueryParams): void
    onResetQueryParams(): void
}

function QueryControls(props: QueryControlsProps) {
    const { queryParams, onQueryParamsChange, onResetQueryParams } = props

    return (
        <QueryControlsWrapper title="Filters" maxHeight={120}>
            <div className="filter-row">
                <div className="filter-section">
                    <div className="title">Name</div>
                    <div>
                        <input
                            className="form-control"
                            value={queryParams ? queryParams.name : ''}
                            onChange={e =>
                                onQueryParamsChange({
                                    name: e.currentTarget.value,
                                    page: queryParams ? queryParams.page : 1
                                })
                            }
                        />
                    </div>
                </div>
                <div className="filter-section">
                    <div className="title">&nbsp;</div>
                    <div>
                        <div className="form-check-inline mt-2">
                            <input
                                type="checkbox"
                                id="checkbox"
                                className="form-check-input"
                                checked={typeof queryParams === 'undefined'}
                                onChange={() => {
                                    if (queryParams) {
                                        onQueryParamsChange(undefined)
                                    } else {
                                        onQueryParamsChange(defaultQueryParams)
                                    }
                                }}
                            />
                            <label htmlFor="checkbox" className="form-check-label">
                                Query params = undefined
                            </label>
                        </div>
                    </div>
                </div>
                <div className="filter-section">
                    <div className="title">&nbsp;</div>
                    <div>
                        <button
                            className="btn btn-secondary"
                            onClick={onResetQueryParams}
                        >
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
    readonly pageSize = 10

    state: PageState = {
        products: [],
        totalPages: 1,
        queryParams: defaultQueryParams,
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
        if (!queryParams) return CancellablePromise.resolve<undefined>(undefined)

        return api.product.list({
            name: queryParams.name,
            page: queryParams.page,
            pageSize: this.pageSize
        })
    }

    onQueryError = () => {
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

        // we really should be preventing non-existent pages here *shrug*

        if (!result) {
            result = {
                products: [],
                totalPages: 0
            }
        }

        this.setState({
            ...result,
            lastAutoRefreshFailed: false
        })
    }

    onQueryParamsChange = (newQueryParams: QueryParams, shouldDebounce: boolean) => {
        const { queryParams } = this.state

        const getJson = (qp: QueryParams) => JSON.stringify(qp)
        const json = getJson(queryParams)
        const newJson = getJson(newQueryParams)

        if (json !== newJson && newQueryParams) {
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
                    onResetQueryParams={() =>
                        this.onQueryParamsChange(defaultQueryParams, false)
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
                {queryParams && (
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
                )}
            </div>
        )
    }

    componentWillUnmount() {
        this.autoRefreshUpdater.dispose()
    }
}