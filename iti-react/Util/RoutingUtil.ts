import { Location } from 'history'
import { isEqual } from 'lodash'

export function locationsAreEqualIgnoringKey(a: Location, b: Location) {
    return (
        a.pathname === b.pathname &&
        a.search === b.search &&
        a.hash === b.hash &&
        isEqual(a.state, b.state)
    )
}
