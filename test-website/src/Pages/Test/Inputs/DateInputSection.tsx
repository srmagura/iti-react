import React, { useState } from 'react'
import {
    DateValidators,
    DateInputValue,
    DateInput,
    useFieldValidity,
    DateInputNoPicker,
    DateInputNoPickerValidators,
    parseDateInputNoPickerValue,
    formatDateInputNoPickerValue,
} from '@interface-technologies/iti-react'
import { ValidityLabel } from './ValidityLabel'
import moment from 'moment-timezone'

interface DateInputSectionProps {
    showValidation: boolean
}

export function DateInputSection({
    showValidation,
}: DateInputSectionProps): React.ReactElement {
    const [onChildValidChange, fieldValidity] = useFieldValidity()
    const vProps = { showValidation, onValidChange: onChildValidChange }

    const [dateInput0Value, setDateInput0Value] = useState<DateInputValue>(null)
    const [dateInput1Value, setDateInput1Value] = useState<DateInputValue>(null)
    const [dateInput2Value, setDateInput2Value] = useState<DateInputValue>(null)
    const [noPicker3Value, setNoPicker3Value] = useState('')
    const [dateInput7Value, setDateInput7Value] = useState<DateInputValue>(moment())
    const [noPicker8Value, setNoPicker8Value] = useState(() =>
        formatDateInputNoPickerValue(moment(), {
            includesTime: true,
            timeZone: 'America/Los_Angeles',
        })
    )
    const [dateInput9Value, setDateInput9Value] = useState<DateInputValue>(null)

    const isWeekend = (date: Date): boolean => {
        const day = date.getDay()
        return day === 0 || day === 6
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
                        onClick={() => setDateInput0Value(null)}
                    >
                        Clear
                    </button>
                    <button
                        className="btn btn-secondary me-3"
                        onClick={() => {
                            setDateInput0Value(moment('2001-01-01T10:00:00.000Z'))
                        }}
                    >
                        Set to 1/1/2001
                    </button>
                </div>
            </div>
            <div className="form-group">
                <label>Required</label> <ValidityLabel valid={fieldValidity.dateInput1} />
                <DateInput
                    name="dateInput1"
                    timeZone="local"
                    value={dateInput1Value}
                    onChange={setDateInput1Value}
                    validators={[DateValidators.required({ includesTime: false })]}
                    {...vProps}
                />
            </div>
            <div className="form-group">
                <label>Date &amp; time selection</label>{' '}
                <ValidityLabel valid={fieldValidity.dateInput2} />
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
                <label>No picker (includesTime=false, required)</label>{' '}
                <ValidityLabel valid={fieldValidity.noPicker3} />
                <div className="d-flex align-items-baseline">
                    <DateInputNoPicker
                        name="noPicker3"
                        validators={[
                            DateInputNoPickerValidators.required({ includesTime: false }),
                        ]}
                        includesTime={false}
                        value={noPicker3Value}
                        onChange={setNoPicker3Value}
                        {...vProps}
                    />
                    <div className="ms-3">
                        Parsed:{' '}
                        {parseDateInputNoPickerValue(noPicker3Value, {
                            includesTime: false,
                            timeZone: 'local',
                        })?.toString()}
                    </div>
                </div>
            </div>
            <div className="form-group">
                <label>Readonly</label> <ValidityLabel valid={fieldValidity.dateInput5} />
                <DateInput
                    name="dateInput5"
                    timeZone="local"
                    readOnly
                    value={moment()}
                    onChange={() => {}}
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
                    <div>
                        UTC:{' '}
                        <b>
                            {dateInput7Value &&
                                dateInput7Value.utc().format('M/D/YYYY H:mm')}
                        </b>
                    </div>
                </div>
            </div>
            <div className="form-group">
                <label>Pacific time, no picker, defaults to the current time</label>{' '}
                <ValidityLabel valid={fieldValidity.noPicker8} />
                <div className="d-flex align-items-baseline">
                    <DateInputNoPicker
                        name="noPicker8"
                        value={noPicker8Value}
                        onChange={setNoPicker8Value}
                        includesTime
                        validators={[]}
                        {...vProps}
                    />
                    <div className="ms-3 me-5">Pacific</div>
                    <div>
                        UTC:{' '}
                        <b>
                            {parseDateInputNoPickerValue(noPicker8Value, {
                                includesTime: true,
                                timeZone: 'America/Los_Angeles',
                            })
                                ?.utc()
                                .format('M/D/YYYY H:mm')}
                        </b>
                    </div>
                </div>
            </div>
            <div className="form-group">
                <label>Filter dates, only allows weekends to be selected</label>{' '}
                <ValidityLabel valid={fieldValidity.dateInput9} />
                <div>
                    <DateInput
                        name="dateInput9"
                        timeZone="local"
                        value={dateInput9Value}
                        onChange={setDateInput9Value}
                        filterDate={(date) => isWeekend(date)}
                        includesTime
                        validators={[]}
                        {...vProps}
                    />
                </div>
            </div>
        </div>
    )
}
