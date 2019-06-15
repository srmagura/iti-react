﻿import * as React from 'react'
import * as moment from 'moment-timezone'
import { ProductDto } from 'Models'
import { PageProps } from 'Components/Routing/RouteProps'
import {
    AutoRefreshUpdater,
    DataUpdater,
    Pager,
    getTdLink,
    CancellablePromise,
    resetPageIfFiltersChanged,
    preventNonExistentPage
} from '@interface-technologies/iti-react'
import { api } from 'Api'
import { NavbarLink } from 'Components'
import { QueryControlsWrapper } from 'Components/QueryControlsWrapper'
import { isConnectionError } from 'Components'

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
    hasConnectionError: boolean
}

export class Page extends React.Component<PageProps, PageState> {
    readonly pageSize = 10

    state: PageState = {
        products: [],
        totalPages: 0,
        queryParams: defaultQueryParams,
        loading: false,
        hasConnectionError: false
    }

    autoRefreshUpdater: AutoRefreshUpdater<QueryParams>

    constructor(props: PageProps) {
        super(props)

        const dataUpdater = new DataUpdater<QueryParams, QueryResult>({
            getCurrentQueryParams: () => this.state.queryParams,
            query: this.query,
            onLoadingChange: loading => this.setState({ loading }),
            onResultReceived: this.onQueryResultReceived,
            onError: props.onError
        })

        this.autoRefreshUpdater = new AutoRefreshUpdater({
            dataUpdater,
            refreshInterval: moment.duration(10, 'seconds'),
            onRefreshingChange: () => {},
            isConnectionError,
            onConnectionError: () => this.setState({ hasConnectionError: true }),
            onOtherError: props.onError
        })

        // Call this function from the browser's console to test that preventNonExistentPage
        // is working correctly
        ;(window as any).set2Pages = () => this.setState({ totalPages: 2 })
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

    onQueryResultReceived = (result: QueryResult) => {
        const { ready, onReady } = this.props

        if (!result) {
            result = {
                products: [],
                totalPages: 0
            }
        }

        this.setState({
            ...result,
            hasConnectionError: false
        })

        if (!ready) {
            onReady({
                title: 'Products',
                activeNavbarLink: NavbarLink.Products,
            })
        }
    }

    componentDidUpdate() {
        const { queryParams, products } = this.state

        if (queryParams) {
            preventNonExistentPage({
                page: queryParams.page,
                items: products,
                onPageChange: page => this.onQueryParamsChange({ ...queryParams, page })
            })
        }
    }

    onQueryParamsChange = (newQueryParams: QueryParams, forceNoDebounce?: boolean) => {
        const { queryParams } = this.state

        let shouldDebounce = false

        if (queryParams && newQueryParams) {
            // Do this before possibly setting page to 1
            !forceNoDebounce && queryParams.page === newQueryParams.page

            newQueryParams = resetPageIfFiltersChanged(queryParams, newQueryParams)
        }

        this.autoRefreshUpdater.handleQueryParamsChange(newQueryParams, shouldDebounce)
        this.setState({ queryParams: newQueryParams })
    }

    render() {
        if (!this.props.ready) return null

        const {
            products,
            queryParams,
            hasConnectionError,
            totalPages,
            loading
        } = this.state

        return (
            <div>
                <p>This serves as a test of DataUpdater and AutoRefreshUpdater.</p>
                <h3>Products</h3>
                {hasConnectionError && (
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
