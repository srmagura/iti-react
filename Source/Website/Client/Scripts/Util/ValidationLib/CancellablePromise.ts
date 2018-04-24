export interface ICancellablePromise<T> extends PromiseLike<T> {
    cancel: () => void
}

// Convenience function
export function cancellableThen<TIn, TOut>(cancellablePromise: ICancellablePromise<TIn>, then: (result: TIn) => TOut):
    ICancellablePromise<TOut> {
    const continuation = cancellablePromise.then(then)

    return {
        cancel: cancellablePromise.cancel,
        then: continuation.then
    }
}

