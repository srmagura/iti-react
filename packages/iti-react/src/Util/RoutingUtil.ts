import { Location } from 'history'
import { isEqual } from 'lodash'

/** Tests if `Location` object are equivalent. */
export function areLocationsEqualIgnoringKey(a: Location, b: Location): boolean {
    return (
        a.pathname === b.pathname &&
        a.search === b.search &&
        a.hash === b.hash &&
        isEqual(a.state, b.state)
    )
}

export function stripTrailingSlash(path: string): string {
    return path.endsWith('/') ? path.slice(0, -1) : path
}

/**
 * Tests if two paths are equivalent by removing trailing slashes and converting to
 * all lowercase.
 */
export function arePathsEqual(path1: string, path2: string): boolean {
    function normalize(p: string): string {
        return stripTrailingSlash(p).toLowerCase()
    }

    return normalize(path1) === normalize(path2)
}
