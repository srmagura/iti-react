import moment from 'moment-timezone'

export function formatDateTimeConfigurable(
    mo: moment.Moment,
    options: {
        onlyShowDateIfNotToday: boolean
        convertToLocal: boolean
        dateTimeFormat: string
        timeFormat: string
    }
): string {
    if (options.convertToLocal) mo = moment(mo).local()

    const alwaysShowDate = !options.onlyShowDateIfNotToday
    const isToday = mo.isSame(moment(), 'day')

    if (!isToday || alwaysShowDate) {
        return mo.format(options.dateTimeFormat)
    }
    return mo.format(options.timeFormat)
}
