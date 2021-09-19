import dayjs from 'dayjs'

/** @internal */
export function getInvalidFeedback(includesTime: boolean): string {
    let invalidFeedback = 'You must enter a valid date (MM/DD/YYYY).'
    if (includesTime) {
        invalidFeedback = 'You must enter a valid date and time.'
    }

    return invalidFeedback
}

/**
 * The Day.js format string used by [[`DateInput`]] and [[`DateInputNoPicker`]] when
 * `includesTime` is false.
 */
export const dateInputFormat = 'M/D/YYYY'

/** @internal */
export const timeFormat = 'h:mm a'

/**
 * The Day.js format string used by [[`DateInput`]] and [[`DateInputNoPicker`]] when
 * `includesTime` is true.
 */
export const dateTimeInputFormat = `${dateInputFormat} ${timeFormat}`

/**
 * @returns either [[`dateInputFormat`]] or [[`dateTimeInputFormat`]]
 */
export function getDateInputFormat(includesTime: boolean): string {
    return includesTime ? dateTimeInputFormat : dateInputFormat
}

/** @internal */
export function getTimeZone(timeZone: string): string {
    return timeZone === 'local' ? dayjs.tz.guess() : timeZone
}
