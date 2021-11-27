import moment from 'moment-timezone'
import {
    formatDateInputNoPickerValue,
    parseDateInputNoPickerValue,
} from './DateInputNoPicker'

test('formatDateInputNoPickerValue', () => {
    const m = moment.parseZone('2021-09-20T03:37:00.441Z')

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
    ).toBe('9/19/2021 10:37 pm')
})

test('parseDateInputNoPickerValue', () => {
    expect(
        parseDateInputNoPickerValue('9/20/2021', {
            includesTime: false,
            timeZone: 'America/Chicago',
        })?.toISOString()
    ).toBe('2021-09-20T00:00:00.000Z')

    expect(
        parseDateInputNoPickerValue('9/20/2021', {
            includesTime: false,
            timeZone: 'Europe/Athens',
        })?.toISOString()
    ).toBe('2021-09-20T00:00:00.000Z')

    expect(
        parseDateInputNoPickerValue('9/20/2021 3:37 pm', {
            includesTime: true,
            timeZone: 'America/Chicago',
        })?.toISOString()
    ).toBe('2021-09-20T20:37:00.000Z')
})

describe('round trip', () => {
    test('includesTime=false', () => {
        const m = moment.parseZone('2021-09-20T03:37:00.441Z')

        const formatted = formatDateInputNoPickerValue(m, {
            includesTime: false,
            timeZone: 'America/Chicago',
        })

        expect(
            parseDateInputNoPickerValue(formatted, {
                includesTime: false,
                timeZone: 'Europe/Athens',
            })?.toISOString()
        ).toBe('2021-09-20T00:00:00.000Z')
    })

    test('includesTime=true', () => {
        const m = moment.parseZone('2021-09-20T03:37:00.441Z')

        const formatted = formatDateInputNoPickerValue(m, {
            includesTime: true,
            timeZone: 'America/Chicago',
        })

        expect(
            parseDateInputNoPickerValue(formatted, {
                includesTime: true,
                timeZone: 'America/Chicago',
            })?.toISOString()
        ).toBe('2021-09-20T03:37:00.000Z')
    })
})
