﻿import 'jest'
import {
    resetPageIfFiltersChanged,
    selectFiltersByExcludingProperties,
} from '../../_Util'

describe('resetPageIfFiltersChanged', () => {
    interface QueryParams {
        name: string
        page: number
        pageSize: number
    }

    const defaultQueryParams: QueryParams = {
        name: '',
        page: 2,
        pageSize: 10,
    }

    const selectFilters = (qp: QueryParams): Partial<QueryParams> =>
        selectFiltersByExcludingProperties(qp, ['page', 'pageSize'])

    test('no change', () => {
        const updatedQueryParams = resetPageIfFiltersChanged(
            defaultQueryParams,
            defaultQueryParams,
            1,
            selectFilters
        )

        expect(updatedQueryParams.page).toBe(defaultQueryParams.page)
    })

    test('filter changed', () => {
        const updatedQueryParams = resetPageIfFiltersChanged(
            defaultQueryParams,
            { ...defaultQueryParams, name: 's' },
            1,
            selectFilters
        )

        expect(updatedQueryParams.page).toBe(1)
    })

    test('page changed', () => {
        const updatedQueryParams = resetPageIfFiltersChanged(
            defaultQueryParams,
            { ...defaultQueryParams, page: 3 },
            1,
            selectFilters
        )

        expect(updatedQueryParams.page).toBe(3)
    })

    test('pageSize changed', () => {
        const updatedQueryParams = resetPageIfFiltersChanged(
            defaultQueryParams,
            { ...defaultQueryParams, pageSize: 25 },
            1,
            selectFilters
        )

        expect(updatedQueryParams.page).toBe(defaultQueryParams.page)
    })
})
