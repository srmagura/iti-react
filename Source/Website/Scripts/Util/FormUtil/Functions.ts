import * as $ from 'jquery';

// TODO update from HpsPortal
export function ajaxErrorHandler(data: any): void {
    let consoleMessage = 'AJAX error diagnostic information: ';
    consoleMessage += JSON.stringify(data);
    console.log(consoleMessage);

    let message = 'Error talking to the server. Reloading the page might help.';
    alert(message);
}

function formToObject(form: HTMLElement): any {
    const array = $(form).serializeArray();
    const obj: any = {};

    for (let pair of array) {
        obj[pair.name] = pair.value;
    }

    return obj;
}

export function submitFormAjax(form: JQuery, url: string, success: (any: any) => void, error: (any: any) => void): void {
    const formObject = formToObject(form[0]);
    const headers: any = {};
    headers['__RequestVerificationToken'] = $('input[name=__RequestVerificationToken]').val();

    $.ajax({
        type: 'POST',
        url: url,
        cache: false,
        headers: headers,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(formObject),
        success: success,
        error: error
    });
}

// from Underscore.js
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function debounce(func: any, wait: any, immediate?: any) {
    var timeout: any;
    return function (this: any) {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};