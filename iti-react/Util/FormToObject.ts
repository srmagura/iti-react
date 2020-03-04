import $ from 'jquery'

export function formToObject(form: JQuery): { [name: string]: string | boolean } {
    const array = form.serializeArray()
    const obj: { [name: string]: string | boolean } = {}

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
/* eslint-disable @typescript-eslint/no-explicit-any */
;(window as any).formToObject = formToObject
/* eslint-enable @typescript-eslint/no-explicit-any */
