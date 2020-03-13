import { renderHook } from '@testing-library/react-hooks'
import { useParameterizedQuery } from '../../../Hooks'
import { CancellablePromise } from '../../../CancellablePromise'

interface QueryParams {
    a: number
}
type Result = string

function query({ a }: QueryParams): CancellablePromise<Result> {
    return CancellablePromise.resolve('[' + a + ']')
}

it('it calls onResultReceived and onLoadingChange', async () => {
    const onResultReceived = jest.fn()
    const onLoadingChange = jest.fn()

    const { result } = renderHook(() =>
        useParameterizedQuery<QueryParams, Result>({
            query,
            shouldQueryImmediately: () => true,
            onResultReceived,
            onLoadingChange,
            onError: fail,
            queryParams: { a: 1 }
        })
    )
    await result.current.doQueryAsync()

    expect(onResultReceived).toHaveBeenCalledWith('[1]')
    expect(onLoadingChange).toHaveBeenCalledWith(true)
    expect(onLoadingChange).toHaveBeenCalledWith(false)
})

it('it returns doQuery and doQueryAsync functions with stable identities', () => {
    const props = {
        query,
        shouldQueryImmediately: () => true,
        onResultReceived: () => {},
        onError: fail
    }

    const { result, rerender } = renderHook(
        props => useParameterizedQuery<QueryParams, Result>(props),
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
