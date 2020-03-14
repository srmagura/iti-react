import { renderHook } from '@testing-library/react-hooks'
import { useValidationInProgressMonitor } from '../../Hooks'

it('returns an onChildProgressChange function with a stable identity', () => {
    const props = {
        onValidationInProgressChange: () => {}
    }

    const { result, rerender } = renderHook(
        props => useValidationInProgressMonitor(props),
        {
            initialProps: {
                ...props,
                defaultValue: { test: false }
            }
        }
    )
    const result0 = result.current

    rerender({ ...props, defaultValue: { test: true } })
    const result1 = result.current

    expect(result0[0]).toBe(result1[0])
    expect(result0[1]).toBe(result1[1])
})
