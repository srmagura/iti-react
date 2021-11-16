import { timeInputValueFromDecimalHours } from './TimeInput'

test('timeInputValueFromDecimalHours', () => {
    expect(timeInputValueFromDecimalHours(9.75)).toEqual({
        hours: 9,
        minutes: 45,
        ampm: 'am',
    })
    expect(timeInputValueFromDecimalHours(13.5)).toEqual({
        hours: 1,
        minutes: 30,
        ampm: 'pm',
    })
    expect(timeInputValueFromDecimalHours(0)).toEqual({
        hours: 12,
        minutes: 0,
        ampm: 'am',
    })
})
