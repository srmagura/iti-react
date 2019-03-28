import { Location } from 'history'
import * as H from 'history'
;(window as any).H = H
//import { PathUtils } from 'history'
import { isEqual } from 'lodash'

export function areLocationsEqualIgnoringKey(a: Location, b: Location) {
    return (
        a.pathname === b.pathname &&
        a.search === b.search &&
        a.hash === b.hash &&
        isEqual(a.state, b.state)
    )
}

export function stripTrailingSlash(path: string) {
    return path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path
}

export function arePathsEqual(path1: string, path2: string): boolean {
    function normalize(p: string) {
        return stripTrailingSlash(p).toLowerCase()
    }

    return normalize(path1) === normalize(path2)
}
