﻿// from SO
export function isInternetExplorer() {
    var ua = window.navigator.userAgent
    var msie = ua.indexOf("MSIE ")

    if (msie > 0 || navigator.userAgent.match(/Trident.*rv\:11\./)) {
        return true
    }

    return false
}
