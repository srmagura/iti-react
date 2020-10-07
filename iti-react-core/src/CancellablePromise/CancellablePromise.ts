import { noop } from 'lodash'

declare function setTimeout(func: () => void, delay: number): number
declare function clearTimeout(timer: number | undefined): void

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
        onRejected?: ((reason: unknown) => TResult) | null
    ): CancellablePromise<TResult> {
        const resultPromise = this.promise.then(onFulfilled, onRejected)

        return new CancellablePromise(resultPromise, this.cancel)
    }

    static resolve(): CancellablePromise<void>

    static resolve<T>(value: T): CancellablePromise<T>

    static resolve(value?: unknown): CancellablePromise<unknown> {
        // The returned promise should resolve even after its canceled.
        // The idea is that the promise is resolved instantaneously, so by the time
        // the promise is canceled, it has already resolved.
        return new CancellablePromise(Promise.resolve(value), noop)
    }

    static reject<T>(reason?: unknown): CancellablePromise<T> {
        return new CancellablePromise(Promise.reject(reason), noop)
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

    static all(promises: CancellablePromise<unknown>[]): CancellablePromise<unknown> {
        return new CancellablePromise<unknown>(
            Promise.all(promises as PromiseLike<unknown>[]),
            () => promises.forEach((p) => p.cancel())
        )
    }

    static delay(ms: number): CancellablePromise<void> {
        let timer: number | undefined
        let rejectFn = noop

        const promise = new Promise<void>((resolve, reject) => {
            timer = setTimeout(resolve, ms)
            rejectFn = reject
        })

        return new CancellablePromise<void>(promise, () => {
            clearTimeout(timer)
            rejectFn()
        })
    }
}
