/* Analogous to fieldValidity and onChildValidChange, but keeps track of which
 * components on the page are ready (finished loading data).
 *
 * Recommended usage:
 *
 *     onChildReady = (args: Partial<Readiness>) => {
 *         this.setState(
 *             s => onChildReady(s, args),
 *             () => {
 *                 // look at this.state.readiness, and if the page is ready to be displayed
 *                 // to the user, call onReady
 *             }
 *         )
 *     }
 */
export function onChildReady<TReadiness, TState extends { readiness: TReadiness }>(
    state: TState,
    p: Partial<TReadiness>
): TState {
    const readiness = { ...state.readiness }

    for (const [key, value] of Object.entries(p)) {
        if (typeof value !== 'undefined') {
            ;(readiness as any)[key] = true
        }
    }

    return { ...state, readiness }
}

export function allReady(readiness: object): boolean {
    return Object.values(readiness).every(v => v)
}
