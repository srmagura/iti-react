import moment from 'moment-timezone'
import {
    convertJsDateToTimeZone,
    parseJsDateIgnoringTimeZone,
    dateInputValueFromMoment,
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
    const date = new Date('Wed Nov 13 2019 09:00:00 GMT-0500')
    const m = parseJsDateIgnoringTimeZone(date, 'America/Los_Angeles')

    expect(m.toISOString()).toBe('2019-11-13T17:00:00.000Z')
})

describe('dateInputValueFromMoment', () => {
    it('does a time zone conversion when includesTime=true', () => {
        const mo = moment.parseZone('1935-05-26T00:00:00+00:00')
        const value = dateInputValueFromMoment(mo, {
            includesTime: true,
            timeZone: 'America/New_York',
        })

        expect(value.moment).toBe(mo)
        expect(value.raw).toBe('5/25/1935 8:00 pm')
    })

    it('does not do a time zone conversion when includesTime=false', () => {
        const mo = moment.parseZone('1935-05-26T00:00:00+00:00')
        const value = dateInputValueFromMoment(mo, { includesTime: false })

        expect(value.moment).toBe(mo)
        expect(value.raw).toBe('5/26/1935')
    })
})
