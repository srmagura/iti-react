import moment from 'moment-timezone'

function replaceUrlParam(param: unknown): unknown[] {
    if (Array.isArray(param)) {
        return param.map(replaceUrlParam)
    }

    if ((param as { [key: string]: unknown })._isAMomentObject) {
        return [(param as moment.Moment).toISOString()]
    }

    return [param]
}

/* To send the same parameter multiple times, do this:
 *
 * formatUrlParams({ userIds: [1, 2, 3] })
 */

export function formatUrlParams(urlParams: { [key: string]: unknown }): string {
    const parts: string[] = []

    for (const k of Object.keys(urlParams)) {
        if (urlParams[k] != null) {
            const valueArray = replaceUrlParam(urlParams[k])

            for (const value of valueArray) {
                if (
                    typeof value !== 'string' &&
                    typeof value !== 'boolean' &&
                    typeof value !== 'number'
                )
                    throw new Error(`Cannot add URL param of type ${typeof value}.`)

                parts.push(`${k}=${encodeURIComponent(value)}`)
            }
        }
    }

    return '?' + parts.join('&')
}
