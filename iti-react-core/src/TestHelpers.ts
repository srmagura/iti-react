import 'jest'
import { CancellablePromise } from './CancellablePromise/CancellablePromise'

// To be used with fake timers. Lets timers and React component async updates run.
// If times = 1, it seems a React component will only update once per call to `wait`.
// Pass times > 1 to more accurately simulate the behavior in the browser.
export function waitForReactUpdatesFactory(
    act: (f: () => Promise<void>) => PromiseLike<void>
) {
    return async function waitForReactUpdates(options?: {
        updateCount?: number
        ms?: number
    }): Promise<void> {
        const updateCount = options?.updateCount ?? 1
        const ms = options?.ms ?? 2000

        async function wait(): Promise<void> {
            const p = CancellablePromise.delay(ms)
            jest.runTimersToTime(ms)
            await p
        }

        for (let i = 0; i < updateCount; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            await act(wait)
        }
    }
}
