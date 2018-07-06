import * as $ from 'jquery'

export function formToObject(form: JQuery) {
    const array = form.serializeArray()
    const obj: any = {}

    for (const pair of array) {
        obj[pair.name] = pair.value
    }

    // serializeArray() ignores checkbox if it's unchecked and puts its value as "on"
    // if it is checked. This doesn't play well with web API so here we turn the
    // checkboxes into booleans.
    const checkboxes = form.find('[type="checkbox"]').toArray()

    for (const checkboxEl of checkboxes) {
        const checkbox = $(checkboxEl)
        const name = checkbox.attr('name')

        if (name) {
            obj[name] = checkbox.is(':checked')
        }
    }

    return obj
}

// for easy debugging
;(window as any).formToObject = formToObject

export function nullToUndefined<T>(x: T | null | undefined): T | undefined {
    if (x == null) return undefined
    return x
}

export function undefinedToNull<T>(x: T | null | undefined): T | null {
    if (typeof x === 'undefined') return null
    return x
}
