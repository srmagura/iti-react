import { renderHook } from '@testing-library/react-hooks'
import { noop } from 'lodash'
import { useValidationInProgressMonitor } from '../../Hooks'

it('returns an onChildProgressChange function with a stable identity', () => {
    const { result, rerender } = renderHook(
        props => useValidationInProgressMonitor(props),
        {
            initialProps: {
                onValidationInProgressChange: noop,
                defaultValue: { test: false }
            }
        }
    )
    const result0 = result.current

    rerender({
        onValidationInProgressChange: noop,
        defaultValue: { test: true }
    })
    const result1 = result.current

    expect(result0[0]).toBe(result1[0])
    expect(result0[1]).toBe(result1[1])
})
