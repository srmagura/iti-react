import * as $ from 'jquery';

export function formToObject(form: JQuery) {
    const array = form.serializeArray()
    const obj: any = {}

    for (const pair of array) {
        obj[pair.name] = pair.value
    }

    return obj
}

// from Underscore.js
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function debounce(func: any, wait: any, immediate?: any) {
    var timeout: any
    return function (this: any) {
        const context = this
        var args = arguments
        const later = () => {
            timeout = null
            if (!immediate) func.apply(this, args)
        }
        const callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func.apply(context, args)
    }
}

export function nullToUndefined<T>(x: T | null | undefined): T | undefined {
    if (x == null) return undefined
    return x
}
