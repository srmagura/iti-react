import moment from 'moment-timezone'
import {
    formatDateInputNoPickerValue,
    parseDateInputNoPickerValue,
} from './DateInputNoPicker'

describe('formatDateInputNoPickerValue', () => {
    test('UTC moment', () => {
        const m = moment.utc('2021-09-20T03:37:00.441Z')

        expect(
            formatDateInputNoPickerValue(m, {
                includesTime: false,
            })
        ).toBe('9/20/2021')

        expect(
            formatDateInputNoPickerValue(m, {
                includesTime: true,
                timeZone: 'America/Chicago',
            })
        ).toBe('9/19/2021 10:37 pm')
    })

    test('Chicago moment', () => {
        const m = moment.utc('2021-09-19T22:37:00.441-05:00')

        expect(
            formatDateInputNoPickerValue(m, {
                includesTime: false,
            })
        ).toBe('9/20/2021')

        expect(
            formatDateInputNoPickerValue(m, {
                includesTime: true,
                timeZone: 'America/Chicago',
            })
        ).toBe('9/19/2021 10:37 pm')
    })
})

test('parseDateInputNoPickerValue', () => {
    expect(
        parseDateInputNoPickerValue('9/20/2021', {
            includesTime: false,
        })?.format()
    ).toBe('2021-09-20T00:00:00Z')

    expect(
        parseDateInputNoPickerValue('9/20/2021 3:37 pm', {
            includesTime: true,
            timeZone: 'America/Chicago',
        })?.format()
    ).toBe('2021-09-20T15:37:00-05:00')
})
