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

    static resolve<T = void>(): CancellablePromise<void>
    static resolve<T>(value: T): CancellablePromise<T>

    static resolve(value?: any): CancellablePromise<any> {
        // The returned promise should resolve even after its canceled.
        // The idea is that the promise is resolved instantaneously, so by the time
        // the promise is canceled, it has already resolved.
        return new CancellablePromise(Promise.resolve(value), () => { /* no-op */})
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

    static all<T>(promises: CancellablePromise<T>[]): CancellablePromise<T[]>

    static all(promises: CancellablePromise<any>[]): CancellablePromise<any> {
        return new CancellablePromise<any>(Promise.all(promises as any) as any, () =>
            promises.forEach(p => p.cancel())
        )
    }
}

export const PSEUDO_PROMISE_CANCELED = 'PSEUDO_PROMISE_CANCELED'

export function pseudoCancellable<T>(promise: PromiseLike<T>): CancellablePromise<T> {
    let canceled = false

    const wrappedPromise = promise.then(result => {
        if (canceled) throw PSEUDO_PROMISE_CANCELED
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

    function cancel() {
        for (const promise of capturedPromises) promise.cancel()
    }

    return new CancellablePromise(innerFunc(capture), cancel)
}
