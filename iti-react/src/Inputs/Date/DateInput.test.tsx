import { render, screen } from '@testing-library/react'
import moment from 'moment-timezone'
import React from 'react'
import {
    DateValidators,
    DateInput,
    convertJsDateToTimeZone,
    parseJsDateIgnoringTimeZone,
} from './DateInput'

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
    const d = moment().year(2021).month(8).date(19).hour(9).minute(0).second(0)
    const date = new Date(d.format('M/D/YYYY, HH:mm:ss [GMT]ZZ'))

    const result = parseJsDateIgnoringTimeZone(date, 'America/Los_Angeles')

    const losAngelesUtcOffset = -7
    const expectedHourUtc = d.hour() - losAngelesUtcOffset

    expect(result.toISOString()).toBe(
        `${d.format('YYYY-MM-DD')}T${expectedHourUtc}:00:00.000Z`
    )
})

describe('DateInput', () => {
    it('displays invalid feedback if the date is null', () => {
        render(
            <DateInput
                name="myDateInput"
                value={null}
                validators={[DateValidators.required({ includesTime: false })]}
                timeZone="local"
                showValidation
            />
        )

        expect(
            screen.queryByText('You must enter a valid date (MM/DD/YYYY).')
        ).toBeVisible()
    })
})
