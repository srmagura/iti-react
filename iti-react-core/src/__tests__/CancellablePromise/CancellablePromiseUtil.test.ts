import 'jest'
import {
    CancellablePromise,
    pseudoCancellable,
    PSEUDO_PROMISE_CANCELED,
    buildCancellablePromise,
} from '../../CancellablePromise'
import { getPromise } from './CancellablePromise.test'

describe('pseudoCancellable', () => {
    test('success', async () => {
        try {
            const number = await pseudoCancellable(Promise.resolve(1))
            expect(number).toBe(1)
        } catch (e) {
            fail('Promise rejected.')
        }
    })

    test('canceled', async () => {
        try {
            const promise = pseudoCancellable(
                new Promise((resolve) => setTimeout(resolve, 1000))
            )

            await CancellablePromise.delay(100)
            promise.cancel()
            await promise

            fail('Promise resolved when it should not have.')
        } catch (e) {
            expect(e.message).toBe(PSEUDO_PROMISE_CANCELED)
        }
    })
})

describe('buildCancellablePromise', () => {
    test('cancellation works', async () => {
        const promise1Duration = 100

        const overallPromise = buildCancellablePromise(async (capture) => {
            await capture(getPromise('1', promise1Duration))

            try {
                await capture(getPromise('2', 3 * promise1Duration))
                fail('Promise 2 resolved when it should have been canceled.')
            } catch {
                // do nothing
            }
        })

        // Wait until promise1 resolves
        await getPromise('', 2 * promise1Duration)

        // This should cause promise2 to be canceled
        overallPromise.cancel()
    })

    test('simultaneous promises captured', async () => {
        const duration = 100

        const overallPromise = buildCancellablePromise(async (capture) => {
            const promise1 = capture(getPromise('1', duration))
            const promise2 = capture(getPromise('2', duration))

            try {
                await promise1
                fail('promise1 resolved')
            } catch {
                // do nothing
            }

            try {
                await promise2
                fail('promise2 resolved')
            } catch {
                // do nothing
            }
        })

        overallPromise.cancel()

        // Wait to see if either promise resolves
        await getPromise('', duration * 2)
    })

    it('rejects when the inner function rejects', async () => {
        const error = new Error('test error')

        try {
            await buildCancellablePromise(async () => {
                throw error
            })
            fail('Resolved.')
        } catch (e) {
            expect(e).toBe(error)
        }
    })

    it('capture does not handle promise rejections', async () => {
        const error = new Error('test error')

        function callApi(): CancellablePromise<never> {
            return CancellablePromise.reject(error)
        }

        try {
            await buildCancellablePromise(async (capture) => {
                await capture(callApi())
            })
            fail('Resolved.')
        } catch (e) {
            expect(e).toBe(error)
        }
    })
})
