import { useRef, useEffect } from 'react'
import { CancellablePromise } from '@interface-technologies/iti-react-core'

// Usage:
//
// const capture = useCancellablePromiseCleanup()
//
// later, in an async function:
//
// const result = await capture(api.get('xyz'))
//
export function useCancellablePromiseCleanup() {
    const cancellablePromisesRef = useRef<CancellablePromise<unknown>[]>([])

    useEffect(() => {
        return () => {
            for (const promise of cancellablePromisesRef.current) {
                promise.cancel()
            }
        }
    }, [])

    function capture<T>(promise: CancellablePromise<T>) {
        cancellablePromisesRef.current.push(promise)
        return promise
    }

    return capture
}
