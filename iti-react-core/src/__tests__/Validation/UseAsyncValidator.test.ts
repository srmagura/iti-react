import { renderHook, act } from '@testing-library/react-hooks'
import { noop } from 'lodash'
import { useAsyncValidator } from '../../Validation/Hooks/UseAsyncValidator'
import { AsyncValidator } from '../../Validation/Validator'
import { CancellablePromise } from '../../CancellablePromise'

it('does not have an infinite loop', async () => {
    const asyncValidator: jest.Mocked<AsyncValidator<string>> = jest.fn(() =>
        CancellablePromise.resolve({ valid: false, invalidFeedback: '' })
    )

    const { rerender } = renderHook(() =>
        useAsyncValidator<string>({
            value: '',
            synchronousValidatorsValid: true,
            asyncValidator,
            onError: noop,
            debounceDelay: 0
        })
    )

    await act(async () => {
        await CancellablePromise.delay(250)
    })
    rerender()
    await act(async () => {
        await CancellablePromise.delay(250)
    })

    expect(asyncValidator).toHaveBeenCalledTimes(1)
})
