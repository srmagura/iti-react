import { renderHook } from '@testing-library/react-hooks'
import { noop } from 'lodash'
import { useFieldValidity } from '../../Hooks'

it('returns an onChildValidChange function with a stable identity', () => {
    const { result, rerender } = renderHook(props => useFieldValidity(props), {
        initialProps: {
            onValidChange: noop,
            defaultValue: { test: false }
        }
    })
    const result0 = result.current

    rerender({ onValidChange: noop, defaultValue: { test: true } })
    const result1 = result.current

    expect(result0[0]).toBe(result1[0])
    expect(result0[1]).toBe(result1[1])
})
