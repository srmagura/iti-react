import { isEqual, defaults } from 'lodash'

export function getTotalPages(itemCount: number, pageSize: number): number {
    return Math.ceil(itemCount / pageSize)
}

export function getPage<T>(allItems: T[], page: number, pageSize: number): T[] {
    const start = (page - 1) * pageSize
    return allItems.slice(start, start + pageSize)
}

export function resetPageIfFiltersChanged<TQueryParams extends { page: number }>(
    queryParams: TQueryParams,
    newQueryParams: TQueryParams,
    firstPage: 0 | 1 = 1
): TQueryParams {
    const withoutPage = (qp: TQueryParams) =>
        Object.entries(qp).filter(([k, v]) => k !== 'page')

    if (!isEqual(withoutPage(queryParams), withoutPage(newQueryParams))) {
        return { ...newQueryParams, page: firstPage }
    }

    return newQueryParams
}

/*
 * Should use this whenever doing server-side paging to account for items being deleted
 * while the user has the list open. Without this function, the user could see an empty
 * page because the number of items, and thus the total number of pages, has decreased.
 *
 * Especially important when using AutoRefreshUpdater since the list could be open for
 * hours.
 *
 * If you forget to use this, it's just incovenient/confusing to the user rather than a
 * serious problem. The user will just see a blank list with no message and will have to
 * navigate back to a page that actually has items.
 *
 * Usage:
 *
 * componentDidUpdate() {
 *      const { queryParams, items } = this.state
 *
 *      preventNonExistentPage({
 *          page: queryParams.page,
 *          items,
 *          onPageChange: page => this.onQueryParamsChange({ ...queryParams, page })
 *      })
 *  }
 */

interface PreventNonExistentPageOptions {
    page: number
    items: any[]
    onPageChange: (page: number) => void
    firstPage?: 0 | 1
}

export function preventNonExistentPage(options: PreventNonExistentPageOptions): void {
    const { page, items, onPageChange, firstPage } = defaults(options, { firstPage: 1 })

    if (page !== firstPage && items.length === 0) {
        onPageChange(page - 1)
    }
}
