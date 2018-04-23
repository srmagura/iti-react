
//export let baseUrl: string | undefined

//export function getUrlCore(path: string) {
//    if (baseUrl == null) {
//        throw new Error('baseUrl not set. Did you call UrlUtil.setBaseUrl?')
//    }

//    // baseUrl ends with /
//    return baseUrl + path
//}

//export function getUrl(partialUrl: string): string {
//    return getUrlCore(partialUrl)
//}

//export function getContentUrl(path: string): string {
//    return getUrlCore('Content/' + path);
//}

export function formatUrlParams(urlParams: any): string {
    let s = '?'
    let wereKeys = false
    for (let k in urlParams) {
        if (urlParams.hasOwnProperty(k) && urlParams[k] != null) {
            wereKeys = true
            s += `${k}=${encodeURIComponent(urlParams[k])}&`
        }
    }

    // Remove last &
    if (wereKeys)
        s = s.substring(0, s.length - 1)

    return s
}