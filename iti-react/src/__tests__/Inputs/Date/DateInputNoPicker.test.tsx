import moment from 'moment-timezone'
import {
    formatDateInputNoPickerValue,
    parseDateInputNoPickerValue,
} from '../../../Inputs'

test('formatDateInputNoPickerValue', () => {
    const m = moment('2021-09-20T20:37:00.441Z')

    expect(
        formatDateInputNoPickerValue(m, {
            includesTime: false,
            timeZone: 'America/Chicago',
        })
    ).toBe('9/20/2021')

    expect(
        formatDateInputNoPickerValue(m, {
            includesTime: true,
            timeZone: 'America/Chicago',
        })
    ).toBe('9/20/2021 3:37 pm')
})

test('parseDateInputNoPickerValue', () => {
    expect(
        parseDateInputNoPickerValue('9/20/2021', {
            includesTime: false,
            timeZone: 'America/Chicago',
        })?.toISOString()
    ).toBe('2021-09-20T05:00:00.000Z')

    expect(
        parseDateInputNoPickerValue('9/20/2021 3:37 pm', {
            includesTime: true,
            timeZone: 'America/Chicago',
        })?.toISOString()
    ).toBe('2021-09-20T20:37:00.000Z')
})
