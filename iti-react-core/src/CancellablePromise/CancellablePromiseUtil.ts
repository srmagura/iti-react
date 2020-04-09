import { CancellablePromise } from './CancellablePromise'

export const PSEUDO_PROMISE_CANCELED = 'PSEUDO_PROMISE_CANCELED'

export function pseudoCancellable<T>(promise: PromiseLike<T>): CancellablePromise<T> {
    let canceled = false

    const wrappedPromise = promise.then(result => {
        if (canceled) throw new Error(PSEUDO_PROMISE_CANCELED)
        return result
    })

    return new CancellablePromise(wrappedPromise, () => {
        canceled = true
    })
}

export type CaptureCancellablePromise = <T>(
    promise: CancellablePromise<T>
) => CancellablePromise<T>

export function buildCancellablePromise<T>(
    innerFunc: (capture: CaptureCancellablePromise) => PromiseLike<T>
): CancellablePromise<T> {
    const capturedPromises: CancellablePromise<unknown>[] = []

    const capture: CaptureCancellablePromise = promise => {
        capturedPromises.push(promise)
        return promise
    }

    function cancel(): void {
        for (const promise of capturedPromises) promise.cancel()
    }

    return new CancellablePromise(innerFunc(capture), cancel)
}
