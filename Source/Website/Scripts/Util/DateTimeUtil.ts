import * as moment from 'moment';

import { IanaTimeZone } from 'Models';
import * as BrowserUtil from 'Util/BrowserUtil';

let timeZone: IanaTimeZone | undefined

export function setTimeZone(tz: IanaTimeZone | undefined) {
    timeZone = tz
}

export const dateFormat = 'M/D/YYYY'
export const timeFormat = 'h:mm a'
export const dateTimeFormat = `${dateFormat} ${timeFormat}`
export const friendlyDateTimeFormat = `${timeFormat} on ${dateFormat}`

/* If you pass in an invalid moment into a format function, it will return "Invalid date".
 *
 * If you want to display an empty string when name is null, you should implement that logic
 * yourself. */

export function formatDate(myMoment: moment.Moment) {
    // No conversion to local or utc
    return myMoment.format(dateFormat)
}

function local(myMoment: moment.Moment) {
    if (BrowserUtil.isBrowser()) {
        // In the browser, MomentJS knows the user's UTC offset
        return myMoment.local()
    }

    // On the server, use the TimeZone cookie we set
    if (typeof timeZone !== 'undefined') {
        return myMoment.tz(timeZone.value)
    }

    // We don't know the user's offset, just use UTC.
    // Not using .local(), because that would give different behavior in Azure than in development.
    return myMoment.utc()
}

export function formatDateTime(myMoment: moment.Moment) {
    return local(myMoment).format(dateTimeFormat)
}

export function formatFriendlyDateTime(myMoment: moment.Moment) {
    return local(myMoment).format(friendlyDateTimeFormat)
}