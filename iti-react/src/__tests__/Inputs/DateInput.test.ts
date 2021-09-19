import dayjs from 'dayjs'
import moment from 'moment-timezone'
import {
    convertJsDateToTimeZone,
    parseJsDateIgnoringTimeZone,
    dateInputValueFromDayjs,
} from '../../Inputs/DateInput'

test('convertJsDateToTimeZone', () => {
    // 12 pm EST / 5 pm UTC
    const easternDate = new Date('Wed Nov 13 2019 12:00:00 GMT-0500')

    // Should be 9 am PST / 5 pm UTC
    const pacificDate = convertJsDateToTimeZone(easternDate, 'America/Los_Angeles')

    // at this point, we just care that year, month, day, hours, minutes, and seconds are right
    // (the offset is ignored)
    expect(pacificDate.toString()).toMatch('Wed Nov 13 2019 09:00:00')
})

test('parseJsDateIgnoringTimeZone', () => {
    const d = dayjs().year(2021).month(8).date(19).hour(9).minute(0).second(0)
    const date = new Date(d.format('M/D/YYYY, HH:mm:ss [GMT]ZZ'))

    const result = parseJsDateIgnoringTimeZone(date, 'America/Los_Angeles')

    const losAngelesUtcOffset = -7
    const expectedHourUtc = d.hour() - losAngelesUtcOffset

    expect(result.toISOString()).toBe(`${d.format('YYYY-MM-DD')}T${expectedHourUtc}:00:00.000Z`)
})

describe('dateInputValueFromMoment', () => {
    it('does a time zone conversion when includesTime=true', () => {
        const mo = moment.parseZone('1935-05-26T00:00:00+00:00')
        const value = dateInputValueFromDayjs(mo, {
            includesTime: true,
            timeZone: 'America/New_York',
        })

        expect(value.moment).toBe(mo)
        expect(value.raw).toBe('5/25/1935 8:00 pm')
    })

    it('does not do a time zone conversion when includesTime=false', () => {
        const mo = moment.parseZone('1935-05-26T00:00:00+00:00')
        const value = dateInputValueFromDayjs(mo, { includesTime: false })

        expect(value.moment).toBe(mo)
        expect(value.raw).toBe('5/26/1935')
    })
})
