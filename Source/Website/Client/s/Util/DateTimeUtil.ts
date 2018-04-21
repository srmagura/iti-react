import * as moment from 'moment';

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

export function formatDateTime(myMoment: moment.Moment) {
    return myMoment.local().format(dateTimeFormat)
}

export function formatFriendlyDateTime(myMoment: moment.Moment) {
    return myMoment.local().format(friendlyDateTimeFormat)
}