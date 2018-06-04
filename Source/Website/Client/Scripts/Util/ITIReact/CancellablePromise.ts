export interface ICancellablePromise<T> extends PromiseLike<T> {
    cancel: () => void
}

// Convenience function that lets you run a synchronous function on the result of an
// ICancellablePromise. Does not support chaining.
export function cancellableThen<TIn, TOut>(
    cancellablePromise: ICancellablePromise<TIn>,
    onFulfilled: (result: TIn) => TOut,
    onRejected?: ((reason?: any) => TOut) | null | undefined
): ICancellablePromise<TOut> {
    const continuation = cancellablePromise.then(onFulfilled, onRejected)
    return withCancel(continuation, cancellablePromise.cancel)
}

// Use this to chain together multiple ICancellablePromises
export function withCancel<T>(
    promise: PromiseLike<T>,
    cancel: () => void
): ICancellablePromise<T> {
    ;(promise as any).cancel = cancel
    return promise as ICancellablePromise<T>
}

// analog of Promise.resolve. Returns a CancellablePromise that resolves with the given value
export function cancellableResolve<T>(value: T): ICancellablePromise<T> {
    return withCancel(Promise.resolve(value), () => {})
}
