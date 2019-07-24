import { useEffect, useRef } from 'react'
import {
    resetPageIfFiltersChanged,
    preventNonExistentPage,
    getTotalPages
} from '@interface-technologies/iti-react'
import { defaults } from 'lodash'

// TODO:SAM MOVE TO ITI-REACT

// A hook that combines three things that need to be implemented when using pagination:
// - Resets page when filters change
// - Returns total number of pages
// - If the current page has no items and is not the first page, decrements the page
//   (prevent non-existent pages). This situation occurs when someone deletes items
//   while the user is viewing a paginated list.
//
// Usage:
//
//     const totalPages = usePagination(/* ... */)
//
export function usePagination<TQueryParams extends { page: number }>(options: {
    queryParams: TQueryParams
    items: any[]
    totalCount: number
    pageSize: number

    onPageChange(page: number): void

    firstPage?: 0 | 1
}): number {
    const {
        queryParams,
        onPageChange,
        firstPage,
        items,
        totalCount,
        pageSize
    } = defaults(options, {
        firstPage: 1
    })

    const prevQueryParamsRef = useRef<TQueryParams>()

    useEffect(() => {
        if (prevQueryParamsRef.current) {
            const newPage = resetPageIfFiltersChanged(
                prevQueryParamsRef.current,
                queryParams,
                firstPage
            ).page

            if (queryParams.page !== newPage) onPageChange(newPage)
        }

        prevQueryParamsRef.current = queryParams
    }, [queryParams])

    useEffect(() => {
        preventNonExistentPage({
            page: queryParams.page,
            items,
            onPageChange,
            firstPage
        })
    }, [items.length === 0])

    return getTotalPages(totalCount, pageSize)
}
