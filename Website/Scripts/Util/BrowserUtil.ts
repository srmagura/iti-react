// from SO
export function isInternetExplorer() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || navigator.userAgent.match(/Trident.*rv\:11\./)) {
        return true;
    }

    return false;
}


export const isBrowser: () => boolean = () => typeof window !== 'undefined';

export function documentReady(func: () => void): void {
    if (isBrowser())
        $(document).ready(func);
}

let _isDocumentReady: boolean = false;

if (isBrowser())
    $(document).ready(() => { _isDocumentReady = true; });

export function isDocumentReady(): boolean {
    return _isDocumentReady;
}
