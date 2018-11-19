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
    // remove Object.assign if typescript fixes generic spread problem
    //const readiness = {...state.readiness}
    const readiness = Object.assign({}, state.readiness) as any

    for (const [key, value] of Object.entries(p)) {
        if (typeof value !== 'undefined') {
            readiness[key] = true
        }
    }

    // return { ...state, readiness }
    return Object.assign({}, state, { readiness })
}

export function allReady(readiness: object): boolean {
    return Object.values(readiness).every(v => v)
}
