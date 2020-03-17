import 'jest'
import { CancellablePromise } from './CancellablePromise'

type Act = (f: () => Promise<void>) => Promise<void>
let act: Act

export function initializeTestHelpers(_act: Act): void {
    act = _act
}

function requireInitialized(): void {
    if (!act) throw new Error('initializeTestHelpers has not been called.')
}

// To be used with fake timers. Lets timers and React component async updates run.
// If times = 1, it seems a React component will only update once per call to `wait`.
// Pass times > 1 to more accurately simulate the behavior in the browser.
export async function waitForReactUpdates(options?: {
    updateCount?: number
    ms?: number
}): Promise<void> {
    requireInitialized()

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
