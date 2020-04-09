import React, { PropsWithChildren } from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { noop } from 'lodash'
import { useAsyncValidator } from '../../Validation/Hooks/UseAsyncValidator'
import { AsyncValidator } from '../../Validation/Validator'
import { CancellablePromise, buildCancellablePromise } from '../../CancellablePromise'
import { waitForReactUpdates } from '../../TestHelpers'
import { ItiReactCoreContext, ItiReactCoreContextData } from '../../ItiReactCoreContext'
import { testItiReactCoreContextData } from '../__helpers__'

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

it('returns valid=true while waiting for debounce delay if asyncValidator is undefined', async () => {
    let value = ''

    const { result, rerender } = renderHook(() =>
        useAsyncValidator<string>({
            value,
            synchronousValidatorsValid: true,
            asyncValidator: undefined,
            onError: noop,
            debounceDelay: 400
        })
    )
    await waitForReactUpdates({ ms: 1000 })

    // Change value
    value = '1'
    rerender()

    // wait until debouceDelay in progress
    await waitForReactUpdates({ ms: 250 })
    expect(result.current.asyncValidationInProgress).toBe(false)
    expect(result.current.asyncValidatorOutput.valid).toBe(true)

    // wait until debounceDelay ends
    await waitForReactUpdates({ ms: 250 })
    expect(result.current.asyncValidationInProgress).toBe(false)
    expect(result.current.asyncValidatorOutput.valid).toBe(true)
})

it('calls onError if the asyncValidator throws', async () => {
    const value = ''

    const error = new Error('test error')
    const asyncValidator: AsyncValidator<string> = () => {
        throw error
    }
    const onError = jest.fn()

    renderHook(() =>
        useAsyncValidator<string>({
            value,
            synchronousValidatorsValid: true,
            asyncValidator,
            onError,
            debounceDelay: 400
        })
    )

    await waitForReactUpdates()
    expect(onError).toHaveBeenCalledWith(error)
})

it("calls onError prop if the asyncValidator's promise rejects and onError prop is provided", async () => {
    const value = ''

    const error = new Error('test error')
    const asyncValidator: AsyncValidator<string> = () => CancellablePromise.reject(error)
    const onError = jest.fn()

    renderHook(() =>
        useAsyncValidator<string>({
            value,
            synchronousValidatorsValid: true,
            asyncValidator,
            onError,
            debounceDelay: 400
        })
    )

    await waitForReactUpdates()
    expect(onError).toHaveBeenCalledWith(error)
})

it("calls ItiReactCoreContext.onError if the asyncValidator's promise rejects and onError prop is undefined", async () => {
    const value = ''

    const error = new Error('test error')
    const asyncValidator: AsyncValidator<string> = () => CancellablePromise.reject(error)

    const onError = jest.fn()
    const contextData: ItiReactCoreContextData = {
        ...testItiReactCoreContextData,
        onError
    }
    const wrapper = ({ children }: PropsWithChildren<{}>) => (
        <ItiReactCoreContext.Provider value={contextData}>
            {children}
        </ItiReactCoreContext.Provider>
    )

    renderHook(
        () =>
            useAsyncValidator<string>({
                value,
                synchronousValidatorsValid: true,
                asyncValidator,
                debounceDelay: 400
            }),
        { wrapper }
    )

    await waitForReactUpdates()
    expect(onError).toHaveBeenCalledWith(error)
})
