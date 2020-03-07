import { useRef, useEffect } from 'react'
import { CancellablePromise } from '@interface-technologies/iti-react-core'
import { CaptureCancellablePromise } from '../CancellablePromise'

// Usage:
//
// const capture = useCancellablePromiseCleanup()
//
// later, in an async function:
//
// const result = await capture(api.get('xyz'))
//
export function useCancellablePromiseCleanup(): CaptureCancellablePromise {
    const cancellablePromisesRef = useRef<CancellablePromise<unknown>[]>([])

    useEffect(() => {
        return (): void => {
            for (const promise of cancellablePromisesRef.current) {
                promise.cancel()
            }
        }
    }, [])

    const capture: CaptureCancellablePromise = promise => {
        cancellablePromisesRef.current.push(promise)
        return promise
    }

    return capture
}
