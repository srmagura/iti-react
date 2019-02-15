import { merge } from 'lodash'

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
export function onChildReady<TReadiness, TState extends { readiness: TReadiness }>(
    state: TState,
    delta: Partial<TReadiness>
): TState {
    const readiness = merge({ ...state.readiness }, delta)

    return { ...state, readiness }
}

export function allReady(readiness: object): boolean {
    return Object.values(readiness).every(v => v)
}
