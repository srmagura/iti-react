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

    static resolve<T>(value: T): CancellablePromise<T> {
        return new CancellablePromise(Promise.resolve(value), () => {})
    }

    static all<T1>(promises: [CancellablePromise<T1>]): CancellablePromise<[T1]>
    static all<T1, T2>(
        promises: [CancellablePromise<T1>, CancellablePromise<T2>]
    ): CancellablePromise<[T1, T2]>
    static all<T1, T2, T3>(
        promises: [CancellablePromise<T1>, CancellablePromise<T2>, CancellablePromise<T3>]
    ): CancellablePromise<[T1, T2, T3]>
    static all<T1, T2, T3, T4>(
        promises: [
            CancellablePromise<T1>,
            CancellablePromise<T2>,
            CancellablePromise<T3>,
            CancellablePromise<T4>
        ]
    ): CancellablePromise<[T1, T2, T3, T4]>
    static all<T1, T2, T3, T4, T5>(
        promises: [
            CancellablePromise<T1>,
            CancellablePromise<T2>,
            CancellablePromise<T3>,
            CancellablePromise<T4>,
            CancellablePromise<T5>
        ]
    ): CancellablePromise<[T1, T2, T3, T4, T5]>
    static all<T1, T2, T3, T4, T5, T6>(
        promises: [
            CancellablePromise<T1>,
            CancellablePromise<T2>,
            CancellablePromise<T3>,
            CancellablePromise<T4>,
            CancellablePromise<T5>,
            CancellablePromise<T6>
        ]
    ): CancellablePromise<[T1, T2, T3, T4, T5, T6]>
    static all<T1, T2, T3, T4, T5, T6, T7>(
        promises: [
            CancellablePromise<T1>,
            CancellablePromise<T2>,
            CancellablePromise<T3>,
            CancellablePromise<T4>,
            CancellablePromise<T5>,
            CancellablePromise<T6>,
            CancellablePromise<T7>
        ]
    ): CancellablePromise<[T1, T2, T3, T4, T5, T6, T7]>
    static all<T1, T2, T3, T4, T5, T6, T7, T8>(
        promises: [
            CancellablePromise<T1>,
            CancellablePromise<T2>,
            CancellablePromise<T3>,
            CancellablePromise<T4>,
            CancellablePromise<T5>,
            CancellablePromise<T6>,
            CancellablePromise<T7>,
            CancellablePromise<T8>
        ]
    ): CancellablePromise<[T1, T2, T3, T4, T5, T6, T7, T8]>
    static all<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
        promises: [
            CancellablePromise<T1>,
            CancellablePromise<T2>,
            CancellablePromise<T3>,
            CancellablePromise<T4>,
            CancellablePromise<T5>,
            CancellablePromise<T6>,
            CancellablePromise<T7>,
            CancellablePromise<T8>,
            CancellablePromise<T9>
        ]
    ): CancellablePromise<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>
    static all<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
        promises: [
            CancellablePromise<T1>,
            CancellablePromise<T2>,
            CancellablePromise<T3>,
            CancellablePromise<T4>,
            CancellablePromise<T5>,
            CancellablePromise<T6>,
            CancellablePromise<T7>,
            CancellablePromise<T8>,
            CancellablePromise<T9>,
            CancellablePromise<T10>
        ]
    ): CancellablePromise<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>

    static all(promises: CancellablePromise<any>[]): CancellablePromise<any> {
        return new CancellablePromise<any>(Promise.all(promises as any) as any, () =>
            promises.forEach(p => p.cancel())
        )
    }
}
