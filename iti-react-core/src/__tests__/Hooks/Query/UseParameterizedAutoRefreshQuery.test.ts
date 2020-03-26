import { renderHook } from '@testing-library/react-hooks'
import moment from 'moment-timezone'
import { noop } from 'lodash'
import { useAutoRefreshQuery } from '../../../Hooks'
import { CancellablePromise } from '../../../CancellablePromise'

interface QueryParams {
    a: number
}
type Result = string

function query({ a }: QueryParams): CancellablePromise<Result> {
    return CancellablePromise.resolve(`[${a}]`)
}

it('stable', () => {
    const props = {
        query,
        shouldQueryImmediately: (): boolean => true,
        onLoadingChange: noop,
        onResultReceived: noop,
        refreshInterval: moment.duration(5, 'seconds'),
        onRefreshingChange: noop,
        onConnectionError: fail,
        onOtherError: fail
    }

    const { result, rerender } = renderHook(
        props => useAutoRefreshQuery<QueryParams, Result>(props),
        {
            initialProps: {
                ...props,
                queryParams: { a: 1 }
            }
        }
    )
    const result0 = result.current

    rerender({ ...props, queryParams: { a: 2 } })
    const result1 = result.current

    expect(result0.doQuery).toBe(result1.doQuery)
    expect(result0.doQueryAsync).toBe(result1.doQueryAsync)
})
