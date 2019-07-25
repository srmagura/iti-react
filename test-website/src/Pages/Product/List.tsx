import * as React from 'react'
import { useState } from 'react'
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
    preventNonExistentPage,
    useParameterizedQuery,
    getTotalPages,
    usePagination
} from '@interface-technologies/iti-react'
import { api } from 'Api'
import { NavbarLink } from 'Components'
import { QueryControlsWrapper } from 'Components/QueryControlsWrapper'
import { isConnectionError } from '_Redux'

interface QueryParams {
    name: string
    page: number
}

const defaultQueryParams: QueryParams = {
    name: '',
    page: 1
}

interface QueryResult {
    products: ProductDto[]
    totalFilteredCount: number
}

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

const pageSize = 10

export function Page(props: PageProps) {
    const { onError, onReady, ready } = props

    const [products, setProducts] = useState<ProductDto[]>([])
    const [totalFilteredCount, setTotalFilteredCount] = useState(0)
    const [loading, setLoading] = useState(false)

    const [queryParams, setQueryParams] = useState<QueryParams>(defaultQueryParams)
    const [hasConnectionError, setHasConnectionError] = useState(false)

    function onResultReceived(result: QueryResult) {
        setHasConnectionError(false)

        setProducts(result.products)
        setTotalFilteredCount(result.totalFilteredCount)

        onReady({
            title: 'Products',
            activeNavbarLink: NavbarLink.Products
        })
    }

    const { doQuery, doQueryAsync } = useParameterizedQuery<QueryParams, QueryResult>({
            queryParams,
            query: qp =>
                api.product.list({
                    name: qp.name,
                    page: qp.page,
                    pageSize
                }),
            shouldQueryImmediately: (prev, curr) => prev.page !== curr.page,
            onLoadingChange: setLoading,
            onResultReceived,
            onError
        })

        // Call from the browser console to test that these methods work
    ;(window as any).doQuery = doQuery
    ;(window as any).doQueryAsync = doQueryAsync

    const totalPages = usePagination({
            queryParams,
            items: products,
            totalCount: totalFilteredCount,
            pageSize,
            onPageChange: page => setQueryParams(qp => ({ ...qp, page }))
        })

        // To test that preventNonExistentPage is working correctly, edit ProductController
        // to only return 10 products. Then call this function from the browser's console
        // and ensure that you are automatically put back on page 1.
    ;(window as any).setPageTo2 = () => setTotalFilteredCount(pageSize + 1)

    if (!ready) return null

    return (
        <div>
            <h3>Products</h3>
            {hasConnectionError && (
                <div className="alert alert-danger" role="alert">
                    Auto refresh failed.
                </div>
            )}
            <QueryControls
                queryParams={queryParams}
                onQueryParamsChange={setQueryParams}
                onResetQueryParams={() => setQueryParams(defaultQueryParams)}
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
                        setQueryParams({
                            ...queryParams,
                            page
                        })
                    }
                />
            )}
        </div>
    )
}
