﻿import * as React from 'react'
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
    usePagination,
    useParameterizedAutoRefreshQuery
} from '@interface-technologies/iti-react'
import { api } from 'Api'
import { NavbarLink } from 'Components'
import { QueryControlsWrapper } from 'Components/QueryControlsWrapper'
import { isConnectionError } from '_Redux'

interface QueryParams {
    name: string
    page: number
    pageSize: number
}

const defaultQueryParams: QueryParams = {
    name: '',
    page: 1,
    pageSize: 10
}

interface QueryResult {
    products: ProductDto[]
    totalFilteredCount: number
    pageSize: number
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
                                    ...queryParams,
                                    name: e.currentTarget.value
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

export type HookName = 'useParameterizedQuery' | 'useParameterizedAutoRefreshQuery'
export const hookNames: HookName[] = [
    'useParameterizedQuery',
    'useParameterizedAutoRefreshQuery'
]

interface ListCoreProps {
    hook: HookName
    onReady(): void
    onError(e: any): void
}

export function ListCore(props: ListCoreProps) {
    const { hook, onError, onReady } = props

    const [products, setProducts] = useState<ProductDto[]>([])
    const [totalFilteredCount, setTotalFilteredCount] = useState(0)
    const [pageSizeWhenProductsRetrieved, setPageSizeWhenProductsRetrieved] = useState(
        defaultQueryParams.pageSize
    )

    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    const [queryParams, setQueryParams] = useState<QueryParams>(defaultQueryParams)
    const [hasConnectionError, setHasConnectionError] = useState(false)

    function onResultReceived(result: QueryResult) {
        setHasConnectionError(false)

        setProducts(result.products)
        setTotalFilteredCount(result.totalFilteredCount)
        setPageSizeWhenProductsRetrieved(result.pageSize)

        onReady()
    }

    let doQuery: () => void
    let doQueryAsync: () => Promise<void>

    // We're breaking the rules of hooks here but it's OK because we force the component
    // to remount when the hook changes
    if (hook === 'useParameterizedQuery') {
        ;({ doQuery, doQueryAsync } = useParameterizedQuery<QueryParams, QueryResult>({
            queryParams,
            query: qp =>
                api.product
                    .list({
                        name: qp.name,
                        page: qp.page,
                        pageSize: qp.pageSize
                    })
                    .then(list => ({ ...list, pageSize: qp.pageSize })),
            shouldQueryImmediately: (prev, curr) =>
                prev.page !== curr.page || prev.pageSize !== curr.pageSize,
            onLoadingChange: setLoading,
            onResultReceived,
            onError
        }))
    } else if (hook === 'useParameterizedAutoRefreshQuery') {
        let startAutoRefresh: () => void
        ;({ doQuery, doQueryAsync, startAutoRefresh } = useParameterizedAutoRefreshQuery<
            QueryParams,
            QueryResult
        >({
            queryParams,
            query: qp =>
                api.product
                    .list({
                        name: qp.name,
                        page: qp.page,
                        pageSize: qp.pageSize
                    })
                    .then(list => ({ ...list, pageSize: qp.pageSize })),
            shouldQueryImmediately: (prev, curr) =>
                prev.page !== curr.page || prev.pageSize !== curr.pageSize,
            onLoadingChange: setLoading,
            onResultReceived,
            autoRefresh: {
                refreshInterval: moment.duration(5, 'seconds'),
                onRefreshingChange: setRefreshing,
                onConnectionError: () => setHasConnectionError(true),
                onOtherError: onError
            }
        }))
        ;(window as any).startAutoRefresh = startAutoRefresh
    } else {
        throw new Error(`Unexpected hook: ${hook}.`)
    }

    // Call from the browser console to test that these methods work
    ;(window as any).doQuery = doQuery
    ;(window as any).doQueryAsync = doQueryAsync

    const totalPages = usePagination({
            queryParams,
            items: products,
            totalCount: totalFilteredCount,
            pageSizeWhenItemsRetrieved: pageSizeWhenProductsRetrieved,
            onPageChange: page => setQueryParams(qp => ({ ...qp, page }))
        })

        // To test that preventNonExistentPage is working correctly, edit ProductController
        // to only return 10 products. Then call this function from the browser's console,
        // go to page 2, and verify that you are automatically put back on page 1.
    ;(window as any).setPageTo2 = () => setTotalFilteredCount(queryParams.pageSize + 1)

    // To test configurable page size. Perhaps should bring ConfigurablePager into iti-react?
    ;(window as any).setPageSize = (pageSize: number) =>
        setQueryParams(qp => ({
            ...qp,
            pageSize: pageSize ? pageSize : defaultQueryParams.pageSize
        }))

    const loadingClasses = ['text-primary', 'd-inline-block', 'mr-3']
    if (!loading) loadingClasses.push('invisible')

    const refreshingClasses = ['text-success', 'd-inline-block']
    if (!refreshing) refreshingClasses.push('invisible')

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
            <div>
                <h5 className={loadingClasses.join(' ')}>Loading</h5>
                <h5 className={refreshingClasses.join(' ')}>Refreshing</h5>
            </div>
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
