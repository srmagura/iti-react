import React, { useEffect, useState } from 'react'
import moment from 'moment-timezone'
import {
    DateValidators,
    DateInputValue,
    DateInput,
    defaultDateInputValue,
    dateInputValueFromMoment,
    useFieldValidity,
} from '@interface-technologies/iti-react'
import { ValidityLabel } from './ValidityLabel'

interface DateInputSectionProps {
    showValidation: boolean
}

export function DateInputSection({ showValidation }: DateInputSectionProps): React.ReactElement {
    const [onChildValidChange, fieldValidity] = useFieldValidity()
    const vProps = { showValidation, onValidChange:onChildValidChange }

    const [dateInput0Value, setDateInput0Value] = useState<DateInputValue>(defaultDateInputValue)
    useEffect(() => {
        console.log(dateInput0Value)
    }, [dateInput0Value])
    const [dateInput1Value, setDateInput1Value] = useState<DateInputValue>(defaultDateInputValue)
    const [dateInput2Value, setDateInput2Value] = useState<DateInputValue>(defaultDateInputValue)
    const [dateInput3Value, setDateInput3Value] = useState<DateInputValue>(defaultDateInputValue)
    const [dateInput7Value, setDateInput7Value] = useState<DateInputValue>(
        dateInputValueFromMoment(moment(), {
            includesTime: true,
            timeZone: 'America/Los_Angeles',
        })
    )
    const [dateInput8Value, setDateInput8Value] = useState<DateInputValue>(
        dateInputValueFromMoment(moment(), {
            includesTime: true,
            timeZone: 'America/Los_Angeles',
        })
    )
    const [dateInput9Value, setDateInput9Value] = useState<DateInputValue>(defaultDateInputValue)

    const isWeekend = (date: Date): boolean => {
        const day = date.getDay();
        return day === 0 || day === 6;
    }

    return (
        <div>
            <div className="form-group">
                <label>Controlled</label>{' '}
                <ValidityLabel valid={fieldValidity.dateInput0} />
                <div className="d-flex" style={{ alignItems: 'baseline' }}>
                    <div className="me-2">
                        <DateInput
                            name="dateInput0"
                            timeZone="local"
                            value={dateInput0Value}
                            onChange={setDateInput0Value}
                            validators={[]}
                            {...vProps}
                        />
                    </div>
                    <button
                        className="btn btn-secondary me-2"
                        onClick={() => setDateInput0Value(defaultDateInputValue)}
                    >
                        Clear
                    </button>
                    <button
                        className="btn btn-secondary me-3"
                        onClick={() => {
                            const m = moment('2001-01-01T10:00:00.000Z')
                            setDateInput0Value(
                                dateInputValueFromMoment(m, {
                                    includesTime: false,
                                })
                            )
                        }}
                    >
                        Set to 1/1/2001
                    </button>
                    <div>Raw: {dateInput0Value.raw}</div>
                </div>
            </div>
            <div className="form-group">
                <label>Required</label> <ValidityLabel valid={fieldValidity.dateInput1} />
                <DateInput
                    name="dateInput1"
                    timeZone="local"
                    value={dateInput1Value}
                    onChange={setDateInput1Value}
                    validators={[DateValidators.required()]}
                    {...vProps}
                />
            </div>
            <div className="form-group">
                <label>Date & time selection</label>{' '}
                <ValidityLabel valid={fieldValidity.dateInput3} />
                <DateInput
                    name="dateInput2"
                    timeZone="local"
                    validators={[DateValidators.required({ includesTime: true })]}
                    includesTime
                    value={dateInput2Value}
                    onChange={setDateInput2Value}
                    timeIntervals={10}
                    {...vProps}
                />
            </div>
            <div className="form-group">
                <label>No datepicker</label>{' '}
                <ValidityLabel valid={fieldValidity.dateInput4} />
                <DateInput
                    name="dateInput3"
                    timeZone="local"
                    validators={[DateValidators.required({ includesTime: true })]}
                    includesTime
                    value={dateInput3Value}
                    onChange={setDateInput3Value}
                    showPicker={false}
                    {...vProps}
                />
            </div>
            <div className="form-group">
                <label>Readonly</label> <ValidityLabel valid={fieldValidity.dateInput5} />
                <DateInput
                    name="dateInput5"
                    timeZone="local"
                    readOnly
                    value={dateInputValueFromMoment(moment(), {
                        includesTime: false,
                    })}
                    onChange={() => { }}
                    validators={[]}
                    {...vProps}
                />
            </div>
            <div className="form-group">
                <label>Pacific time, defaults to the current time</label>{' '}
                <ValidityLabel valid={fieldValidity.dateInput7} />
                <div className="d-flex align-items-baseline">
                    <DateInput
                        name="dateInput7"
                        timeZone="America/Los_Angeles"
                        value={dateInput7Value}
                        onChange={setDateInput7Value}
                        includesTime
                        validators={[]}
                        {...vProps}
                    />
                    <div className="ms-3 me-5">Pacific</div>
                    <div className="me-5">
                        UTC:{' '}
                        <b>
                            {dateInput7Value.moment &&
                                dateInput7Value.moment.utc().format('M/D/YYYY H:mm')}
                        </b>
                    </div>
                    <div>
                        Raw:{' '}
                        <b>
                            {dateInput7Value.raw}
                        </b>
                    </div>
                </div>
            </div>
            <div className="form-group">
                <label>
                    Pacific time, no picker, defaults to the current time
                </label>{' '}
                <ValidityLabel valid={fieldValidity.dateInput8} />
                <div className="d-flex align-items-baseline">
                    <DateInput
                        name="dateInput8"
                        timeZone="America/Los_Angeles"
                        value={dateInput8Value}
                        onChange={setDateInput8Value}
                        showPicker={false}
                        includesTime
                        validators={[]}
                        {...vProps}
                    />
                    <div className="ms-3 me-5">Pacific</div>
                    <div>
                        UTC:{' '}
                        <b>
                            {dateInput8Value.moment &&
                                dateInput8Value.moment.utc().format('M/D/YYYY H:mm')}
                        </b>
                    </div>
                </div>
            </div>
            <div className="form-group">
                <label>
                    Filter dates, only allows weekends to be selected
                </label>{' '}
                <ValidityLabel valid={fieldValidity.dateInput9} />
                <div className="d-flex align-items-baseline">
                    <DateInput
                        name="dateInput9"
                        timeZone="local"
                        value={dateInput9Value}
                        onChange={setDateInput9Value}
                        filterDate={date => isWeekend(date)}
                        includesTime
                        validators={[]}
                        {...vProps}
                    />
                </div>
            </div>
        </div>
    )
}
