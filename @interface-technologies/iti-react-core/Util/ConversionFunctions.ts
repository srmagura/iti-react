export function nullToUndefined<T>(x: T | null | undefined): T | undefined {
    if (x == null) return undefined
    return x
}

export function undefinedToNull<T>(x: T | null | undefined): T | null {
    if (typeof x === 'undefined') return null
    return x
}

export function stringToEmpty(s: string | null | undefined): string {
    if (typeof s !== 'string') return ''
    return s
}
