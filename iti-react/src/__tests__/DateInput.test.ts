import 'jest'
import { convertJsDateToTimeZone, parseJsDateIgnoringTimeZone } from '../Inputs/DateInput'

test('convertJsDateToTimeZone', () => {
    // 12 pm EST / 5 pm UTC
    const easternDate = new Date('Wed Nov 13 2019 12:00:00 GMT-0500')

    // Should be 9 am PST / 5 pm UTC
    const pacificDate = convertJsDateToTimeZone(easternDate, 'America/Los_Angeles')

    // at this point, we just care that year, month, day, hours, minutes, and seconds are right
    // (the offset is ignored)
    expect(pacificDate.toString()).toBe(
        'Wed Nov 13 2019 09:00:00 GMT-0500 (Eastern Standard Time)'
    )
})

test('parseJsDateIgnoringTimeZone', () => {
    const date = new Date('Wed Nov 13 2019 09:00:00 GMT-0500')
    const m = parseJsDateIgnoringTimeZone(date, 'America/Los_Angeles')

    expect(m.toString()).toBe('Wed Nov 13 2019 09:00:00 GMT-0800')
})
