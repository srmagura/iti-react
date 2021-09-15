import React, { PropsWithChildren } from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { noop } from 'lodash'
import { useAsyncValidator } from '../../Validation/Hooks/UseAsyncValidator'
import { AsyncValidator } from '../../Validation/Validator'
import { CancellablePromise, buildCancellablePromise } from 'real-cancellable-promise'
import { ItiReactCoreContext, ItiReactCoreContextData } from '../../ItiReactCoreContext'
import { testItiReactCoreContextData, waitForHookUpdates } from '../__helpers__'

jest.useFakeTimers()

it('uses the asyncValidator to determine validity', async () => {
    const asyncValidator: AsyncValidator<string> = (value: string) =>
        CancellablePromise.resolve({ valid: !!value, invalidFeedback: 'myFeedback' })

    let value = ''

    const { result, rerender } = renderHook(() =>
        useAsyncValidator<string>({
            value,
            synchronousValidatorsValid: true,
            asyncValidator,
            onError: noop,
            debounceDelay: 400,
        })
    )

    expect(result.current.asyncValidatorOutput.valid).toBe(false)

    await waitForHookUpdates()
    expect(result.current.asyncValidatorOutput).toEqual({
        valid: false,
        invalidFeedback: 'myFeedback',
    })

    value = '1'
    rerender()

    await waitForHookUpdates()
    expect(result.current.asyncValidatorOutput.valid).toBe(true)
})

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
            debounceDelay: 0,
        })
    )

    await waitForHookUpdates({ updateCount: 3 })
    rerender()
    await waitForHookUpdates({ updateCount: 3 })

    expect(asyncValidator).toHaveBeenCalledTimes(1)
})

it('returns valid=false and asyncValidationInProgress=true while validation is in progress', async () => {
    const asyncValidator: AsyncValidator<string> = () =>
        buildCancellablePromise(async (capture) => {
            await capture(CancellablePromise.delay(1000))
            return { valid: true, invalidFeedback: '' }
        })

    let value = ''

    const { result, rerender } = renderHook(() =>
        useAsyncValidator<string>({
            value,
            synchronousValidatorsValid: true,
            asyncValidator,
            onError: noop,
            debounceDelay: 400,
        })
    )

    async function expectInvalidWhileInProgress(): Promise<void> {
        // asyncValidator in progress
        await waitForHookUpdates({ ms: 250 })
        expect(result.current.asyncValidationInProgress).toBe(true)
        expect(result.current.asyncValidatorOutput.valid).toBe(false)

        // asyncValidator complete
        await waitForHookUpdates({ ms: 1000 })
        expect(result.current.asyncValidationInProgress).toBe(false)
        expect(result.current.asyncValidatorOutput.valid).toBe(true)
    }

    await expectInvalidWhileInProgress()

    // Change value
    value = '1'
    rerender()

    // debouceDelay in progress
    await waitForHookUpdates({ ms: 250 })
    expect(result.current.asyncValidationInProgress).toBe(false)
    expect(result.current.asyncValidatorOutput.valid).toBe(false)

    await expectInvalidWhileInProgress()
})

it('returns asyncValidationInProgress=false if asyncValidator is defined and synchronousValidatorsValid=false', async () => {
    const asyncValidator: AsyncValidator<unknown> = () => {
        throw new Error('Should never be called.')
    }

    let value = ''

    const { result, rerender } = renderHook(() =>
        useAsyncValidator<string>({
            value,
            synchronousValidatorsValid: false,
            asyncValidator,
            onError: noop,
            debounceDelay: 400,
        })
    )

    async function expectNotInProgress() {
        for (let i = 0; i < 10; i++) {
            expect(result.current.asyncValidationInProgress).toBe(false)
            await waitForHookUpdates({ ms: 100 })
        }
    }

    await expectNotInProgress()

    // Change value
    value = '1'
    rerender()

    await expectNotInProgress()
})

it('returns valid=true while waiting for debounce delay if asyncValidator is undefined', async () => {
    let value = ''

    const { result, rerender } = renderHook(() =>
        useAsyncValidator<string>({
            value,
            synchronousValidatorsValid: true,
            asyncValidator: undefined,
            onError: noop,
            debounceDelay: 400,
        })
    )
    await waitForHookUpdates({ ms: 1000 })

    // Change value
    value = '1'
    rerender()

    // wait until debouceDelay in progress
    await waitForHookUpdates({ ms: 250 })
    expect(result.current.asyncValidationInProgress).toBe(false)
    expect(result.current.asyncValidatorOutput.valid).toBe(true)

    // wait until debounceDelay ends
    await waitForHookUpdates({ ms: 250 })
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
            debounceDelay: 400,
        })
    )

    await waitForHookUpdates()
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
            debounceDelay: 400,
        })
    )

    await waitForHookUpdates()
    expect(onError).toHaveBeenCalledWith(error)
})

it("calls ItiReactCoreContext.onError if the asyncValidator's promise rejects and onError prop is undefined", async () => {
    const value = ''

    const error = new Error('test error')
    const asyncValidator: AsyncValidator<string> = () => CancellablePromise.reject(error)

    const onError = jest.fn()
    const contextData: ItiReactCoreContextData = {
        ...testItiReactCoreContextData,
        onError,
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
                debounceDelay: 400,
            }),
        { wrapper }
    )

    await waitForHookUpdates()
    expect(onError).toHaveBeenCalledWith(error)
})
