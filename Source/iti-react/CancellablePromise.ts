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

//////////////////////////////////////////////////////////////////

export class CancellablePromise<T> {
    readonly promise: PromiseLike<T>
    readonly cancel: () => void

    constructor(promise: PromiseLike<T>, cancel: () => void) {
        this.promise = promise
        this.cancel = cancel
    }

    // This method is to allow you to perform a synchronous operation after the promise resolves.
    // So the method does not allow onFulfilled to return a promise.
    then<TResult>(
        onFulfilled?: ((value: T) => TResult) | null,
        onRejected?: ((reason: any) => TResult) | null
    ): CancellablePromise<TResult> {
        const resultPromise = this.promise.then(onFulfilled, onRejected)

        return new CancellablePromise(resultPromise, this.cancel)
    }

    static all<T1, T2>(
        promises: [CancellablePromise<T1>, CancellablePromise<T2>]
    ): CancellablePromise<[T1, T2]> {
        return new CancellablePromise<[T1, T2]>(Promise.all(promises as any) as any, () =>
            promises.forEach(p => p.cancel())
        )
    }

    static resolve<T>(value: T): CancellablePromise<T> {
        return new CancellablePromise(Promise.resolve(value), () => {})
    }
}
