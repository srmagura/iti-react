function replaceUrlParam(param: any): any[] {
    if (Array.isArray(param)) {
        return param.map(replaceUrlParam)
    }

    if (param._isAMomentObject) {
        return [param.toISOString()]
    }

    return [param]
}

export function formatUrlParams(urlParams: { [key: string]: any }): string {
    const parts: string[] = []

    for (const k of Object.keys(urlParams)) {
        if (urlParams[k] != null) {
            const valueArray = replaceUrlParam(urlParams[k])

            for (const value of valueArray) {
                parts.push(`${k}=${encodeURIComponent(value)}`)
            }
        }
    }

    return '?' + parts.join('&')
}
