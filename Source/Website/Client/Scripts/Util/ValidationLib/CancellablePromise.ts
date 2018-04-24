export interface ICancellablePromise<T> extends PromiseLike<T> {
    cancel: () => void
}

// Convenience function
export function cancellableThen<TIn, TOut>(cancellablePromise: ICancellablePromise<TIn>,
        onFulfilled: (result: TIn) => TOut,
        onRejected?: ((reason?: any) => TOut) | null | undefined):
    ICancellablePromise<TOut> {
    const continuation = cancellablePromise.then(onFulfilled, onRejected)

    return {
        cancel: cancellablePromise.cancel,
        then: continuation.then
    }
}

