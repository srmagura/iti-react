export function formatUrlParams(urlParams: any): string {
    function formatValue(v: any) {
        if (v._isAMomentObject) {
            return v.toISOString()
        }

        return v
    }

    let s = ''
    let wereKeys = false
    for (let k in urlParams) {
        if (urlParams.hasOwnProperty(k) && urlParams[k] != null) {
            wereKeys = true
            const formattedValue = formatValue(urlParams[k])
            s += `${k}=${encodeURIComponent(formattedValue)}&`
        }
    }

    if (wereKeys) {
        // Remove last &
        s = s.substring(0, s.length - 1)
        s = '?' + s
    }

    return s
}