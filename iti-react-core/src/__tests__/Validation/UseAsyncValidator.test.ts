import { renderHook } from '@testing-library/react-hooks'
import { noop } from 'lodash'
import { useAsyncValidator } from '../../Validation/Hooks/UseAsyncValidator'
import { AsyncValidator } from '../../Validation/Validator'
import { CancellablePromise, buildCancellablePromise } from '../../CancellablePromise'
import { waitForReactUpdates } from '../../TestHelpers'

jest.useFakeTimers()

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

    await waitForReactUpdates({ updateCount: 3 })
    rerender()
    await waitForReactUpdates({ updateCount: 3 })

    expect(asyncValidator).toHaveBeenCalledTimes(1)
})

it('returns valid=false while validation is in progress', async () => {
    const asyncValidator: jest.Mocked<AsyncValidator<string>> = jest.fn(() =>
        buildCancellablePromise(async capture => {
            await capture(CancellablePromise.delay(1000))
            return { valid: true, invalidFeedback: '' }
        })
    )

    let value = ''

    const { result, rerender } = renderHook(() =>
        useAsyncValidator<string>({
            value,
            synchronousValidatorsValid: true,
            asyncValidator,
            onError: noop,
            debounceDelay: 400
        })
    )

    async function expectInvalidWhileInProgress(): Promise<void> {
        // asyncValidator in progress
        await waitForReactUpdates({ ms: 250 })
        expect(result.current.asyncValidationInProgress).toBe(true)
        expect(result.current.asyncValidatorOutput.valid).toBe(false)

        // asyncValidator complete
        await waitForReactUpdates({ ms: 1000 })
        expect(result.current.asyncValidationInProgress).toBe(false)
        expect(result.current.asyncValidatorOutput.valid).toBe(true)
    }

    await expectInvalidWhileInProgress()

    // Change value
    value = '1'
    rerender()

    // debouceDelay in progress
    await waitForReactUpdates({ ms: 250 })
    expect(result.current.asyncValidationInProgress).toBe(false)
    expect(result.current.asyncValidatorOutput.valid).toBe(false)

    await expectInvalidWhileInProgress()
})
