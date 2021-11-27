import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Returns true if all values in the object are true. For use with
 * [[`useReadiness`]].
 */
export function allReady<T extends { [K in keyof T]: boolean }>(readiness: T): boolean {
    return Object.values(readiness).every((v) => v)
}

/**
 * Used to call `onReady` when all of the components/queries in a page are ready.
 *
 * ```
 * const [onChildReady, readiness] = useReadiness(
 *     {
 *         a: false, b: false, c: false
 *     },
 *     readiness => {
 *         if (allReady(readiness)) {
 *             onReady({ ... })
 *         }
 *     },
 * )
 * ```
 */
export function useReadiness<TReadiness>(
    defaultValue: TReadiness,
    onChange: (readiness: TReadiness) => void
): [(delta: Partial<TReadiness>) => void, TReadiness] {
    const [readiness, setReadiness] = useState(defaultValue)

    const onChangeRef = useRef(onChange)
    useEffect(() => {
        onChangeRef.current = onChange
    })

    useEffect(() => {
        onChangeRef.current(readiness)
    }, [readiness])

    const onChildReady = useCallback(
        (delta: Partial<TReadiness>) => {
            setReadiness((readiness) => ({ ...readiness, ...delta }))
        },
        [setReadiness]
    )

    return [onChildReady, readiness]
}
