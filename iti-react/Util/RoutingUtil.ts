import { Location } from 'history'
import { stripTrailingSlash } from 'history/PathUtils'
import { isEqual } from 'lodash'

export function areLocationsEqualIgnoringKey(a: Location, b: Location) {
    return (
        a.pathname === b.pathname &&
        a.search === b.search &&
        a.hash === b.hash &&
        isEqual(a.state, b.state)
    )
}

export function arePathsEqual(path1: string, path2: string): boolean {
    function normalize(p: string) {
        return stripTrailingSlash(p).toLowerCase()
    }

    return normalize(path1) === normalize(path2)
}
