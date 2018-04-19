import * as moment from 'moment-timezone';
import { ReactViewModel } from 'Models';

import * as BrowserUtil from 'Util/BrowserUtil';
import * as FormUtil from 'Util/FormUtil';
import * as DateTimeUtil from 'Util/DateTimeUtil';
import * as ErrorUtil from 'Util/Plumbing/ErrorUtil';
import * as UrlUtil from 'Util/UrlUtil';

// So the server can display datetimes in the right offset
// Reference: http://afana.me/archive/2014/04/06/aspnet-mvc-internationalization-date-time.aspx/
function setTimezoneCookie() {
    if (!BrowserUtil.isBrowser()) {
        return
    }

    function cookieExists(name: string) {
        const nameToFind = name + "="
        const cookies = document.cookie.split(';')
        for (var i = 0; i < cookies.length; i++) {
            if (cookies[i].trim().indexOf(nameToFind) === 0) return true
        }
        return false
    }

    if (!cookieExists("TimeZone")) {
        const guess = moment.tz.guess()

        const tenDaysInSeconds = 10 * 24 * 60 * 60
        document.cookie = "TimeZone=" + guess +
            ";max-age=" + tenDaysInSeconds +
            ";path=/;" + document.cookie
    }
}

export function pageBootstrap(reactViewModel: ReactViewModel) {
    UrlUtil.setBaseUrl(reactViewModel.baseUrl)

    ErrorUtil.setIsDebug(reactViewModel.isDebug)
    ErrorUtil.setup()

    setTimezoneCookie()
    DateTimeUtil.setTimeZone(FormUtil.nullToUndefined(reactViewModel.timeZone))
}