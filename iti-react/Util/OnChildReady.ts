import { merge, isEqual } from 'lodash'
import { useState, useEffect } from 'react';

/* Analogous to fieldValidity and onChildValidChange, but keeps track of which
 * components on the page are ready (finished loading data).
 *
 * onChildReady supports deep updates, since it uses lodash's merge function.
 *
 * Recommended usage:
 *
 *     onChildReady = (delta: Partial<Readiness>) => {
 *         this.setState(
 *             s => onChildReady(s, delta),
 *             () => {
 *                 // look at this.state.readiness, and if the page is ready to be displayed
 *                 // to the user, call onReady
 *             }
 *         )
 *     }
 */
// DEPRECATED
export function onChildReady<TReadiness, TState extends { readiness: TReadiness }>(
    state: TState,
    delta: Partial<TReadiness>
): TState {
    const readiness = merge({ ...state.readiness }, delta)

    return { ...state, readiness }
}

/* Analogous to fieldValidity and onChildValidChange, but keeps track of which
 * components on the page are ready (finished loading data).
 *
 * onChildReady supports deep updates, since it uses lodash's merge function.
 *
 * The callback is only executed if the readiness actually changed.
 *
 * Recommended usage:
 *
 *     onChildReady = (delta: Partial<Readiness>) => {
 *         onChildReady(
 *             x => this.setState(...x),
 *             delta,
 *             () => {
 *                 // look at this.state.readiness, and if the page is ready to be displayed
 *                 // to the user, call onReady
 *             }
 *         )
 *     }
 */
export function onChildReady2<TReadiness, TState extends { readiness: TReadiness }>(
    setState: (args: [(state: TState) => TState, () => void]) => void,
    delta: Partial<TReadiness>,
    callback: () => void
) {
    let readinessChanged: boolean

    setState([
        state => {
            const newReadiness = merge({ ...state.readiness }, delta)
            readinessChanged = !isEqual(state.readiness, newReadiness)

            return {
                ...state,
                readiness: newReadiness
            }
        },
        () => {
            if (readinessChanged) callback()
        }
    ])
}

export function allReady(readiness: object): boolean {
    return Object.values(readiness).every(v => v)
}


// Usage:
//
// interface Readiness {
//     a: boolean
//     b: boolean
//     c: boolean
// }
//
// const [onChildReady, readiness] = useReadiness<Readiness>(
//     {
//         a: false, b: false, c: false
//     },
//     readiness => {
//         if (allReady(readiness)) { 
//             onReady(/* ... */) 
//         }
//     },
// )
//
export function useReadiness<TReadiness>(defaultValue: TReadiness, onChange: (readiness: TReadiness) => void):[(delta: Partial<TReadiness>) => void, TReadiness] {
    const [readiness, setReadiness] = useState(defaultValue)

    // Deep comparison on readiness to avoid causing unnecessary updates
    useEffect(() => { onChange(readiness)}, [JSON.stringify(readiness)])

    function onChildReady(delta: Partial<TReadiness>): void {
        setReadiness(readiness => {
            return merge({ ...readiness }, delta)
        })
    }

    return [onChildReady, readiness]
} 