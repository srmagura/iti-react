import * as $ from 'jquery'

export function formToObject(form: JQuery) {
    const array = form.serializeArray()
    const obj: any = {}

    for (const pair of array) {
        obj[pair.name] = pair.value
    }

    return obj
}

export function nullToUndefined<T>(x: T | null | undefined): T | undefined {
    if (x == null) return undefined
    return x
}
