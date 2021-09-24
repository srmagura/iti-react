import { renderHook } from '@testing-library/react-hooks'
import { noop } from 'lodash'
import { useValidationInProgressMonitor } from '../../Hooks'

it('returns an onChildProgressChange function with a stable identity', () => {
    const { result, rerender } = renderHook(
        (props) => useValidationInProgressMonitor(props),
        {
            initialProps: {
                onValidationInProgressChange: noop,
                defaultValue: { test: false },
            },
        }
    )
    const onChildProgressChange0 = result.current.onChildProgressChange

    rerender({
        onValidationInProgressChange: noop,
        defaultValue: { test: true },
    })
    const onChildProgressChange1 = result.current.onChildProgressChange

    expect(onChildProgressChange0).toBe(onChildProgressChange1)
})
