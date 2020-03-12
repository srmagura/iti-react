import { renderHook } from '@testing-library/react-hooks'
import { useParameterizedAutoRefreshQuery } from '../../../Hooks'
import { CancellablePromise } from '../../../CancellablePromise'
import moment from 'moment-timezone'

interface QueryParams {
    a: number
}
type Result = string

function query({ a }: QueryParams): CancellablePromise<Result> {
    return CancellablePromise.resolve('[' + a + ']')
}

it('stable', () => {
    const props = {
        query,
        shouldQueryImmediately: () => true,
        onLoadingChange: () => {},
        onResultReceived: () => {},
        refreshInterval: moment.duration(5, 'seconds'),
        onRefreshingChange: () => {},
        onConnectionError: fail,
        onOtherError: fail
    }

    const { result, rerender } = renderHook(
        props => useParameterizedAutoRefreshQuery<QueryParams, Result>(props),
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
