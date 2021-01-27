﻿import { useRef, useEffect, useCallback } from 'react'
import { CaptureCancellablePromise, CancellablePromise } from '../CancellablePromise'

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

    // This eslint error is not releveant between the ref does not point to a DOM node
    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(
        () => (): void => {
            for (const promise of cancellablePromisesRef.current) {
                promise.cancel()
            }
        },
        []
    )
    /* eslint-enable react-hooks/exhaustive-deps */

    const capture: CaptureCancellablePromise = useCallback((promise) => {
        cancellablePromisesRef.current.push(promise)
        return promise
    }, [])

    return capture
}
