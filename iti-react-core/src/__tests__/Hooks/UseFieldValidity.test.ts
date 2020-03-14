import { renderHook } from '@testing-library/react-hooks'
import { useFieldValidity } from '../../Hooks'

it('returns an onChildValidChange function with a stable identity', () => {
    const props = {
        onValidChange: (valid: boolean) => {}
    }

    const { result, rerender } = renderHook(props => useFieldValidity(props), {
        initialProps: {
            ...props,
            defaultValue: { test: false }
        }
    })
    const result0 = result.current

    rerender({ ...props, defaultValue: { test: true } })
    const result1 = result.current

    expect(result0[0]).toBe(result1[0])
    expect(result0[1]).toBe(result1[1])
})
