export interface ICancellablePromise<T> extends PromiseLike<T> {
    cancel: () => void
}

//export interface ICancellablePromise<T> extends Pick<Promise<T>, 'then'> {
//    cancel: () => void
//    cancellableThen((result: T) => T | Promise<T> | null | undefined) { }
//}