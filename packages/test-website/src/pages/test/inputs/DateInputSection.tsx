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
import moment from 'moment-timezone'
import { TestFormGroup } from './TestFormGroup'

interface DateInputSectionProps {
    showValidation: boolean
}

export function DateInputSection({
    showValidation,
}: DateInputSectionProps): React.ReactElement {
    const { onChildValidChange, fieldValidity } = useFieldValidity()
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
            <TestFormGroup label="Controlled" valid={fieldValidity.dateInput0}>
                {(id) => (
                    <div className="d-flex" style={{ alignItems: 'baseline' }}>
                        <div className="me-2">
                            <DateInput
                                id={id}
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
                            type="button"
                        >
                            Clear
                        </button>
                        <button
                            className="btn btn-secondary me-3"
                            onClick={() => {
                                setDateInput0Value(moment('2001-01-01T10:00:00.000Z'))
                            }}
                            type="button"
                        >
                            Set to 1/1/2001
                        </button>
                    </div>
                )}
            </TestFormGroup>
            <TestFormGroup label="Required" valid={fieldValidity.dateInput1}>
                {(id) => (
                    <DateInput
                        id={id}
                        name="dateInput1"
                        timeZone="local"
                        value={dateInput1Value}
                        onChange={setDateInput1Value}
                        validators={[DateValidators.required({ includesTime: false })]}
                        {...vProps}
                    />
                )}
            </TestFormGroup>
            <TestFormGroup
                label={<>Date &amp; time selection</>}
                valid={fieldValidity.dateInput2}
            >
                {(id) => (
                    <DateInput
                        id={id}
                        name="dateInput2"
                        timeZone="local"
                        validators={[DateValidators.required({ includesTime: true })]}
                        includesTime
                        value={dateInput2Value}
                        onChange={setDateInput2Value}
                        timeIntervals={10}
                        {...vProps}
                    />
                )}
            </TestFormGroup>
            <TestFormGroup
                label="No picker (includesTime=false, required)"
                valid={fieldValidity.noPicker3}
            >
                {(id) => (
                    <div className="d-flex align-items-baseline">
                        <DateInputNoPicker
                            id={id}
                            name="noPicker3"
                            validators={[
                                DateInputNoPickerValidators.required({
                                    includesTime: false,
                                }),
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
                            })?.toString()}
                        </div>
                    </div>
                )}
            </TestFormGroup>
            <TestFormGroup label="Readonly" valid={fieldValidity.dateInput5}>
                {(id) => (
                    <DateInput
                        id={id}
                        name="dateInput5"
                        timeZone="local"
                        readOnly
                        value={moment()}
                        onChange={() => {}}
                        validators={[]}
                        {...vProps}
                    />
                )}
            </TestFormGroup>
            <TestFormGroup
                label="Pacific time, defaults to the current time"
                valid={fieldValidity.dateInput7}
            >
                {(id) => (
                    <div className="d-flex align-items-baseline">
                        <DateInput
                            id={id}
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
                )}
            </TestFormGroup>
            <TestFormGroup
                label="Pacific time, no picker, defaults to the current time"
                valid={fieldValidity.noPicker8}
            >
                {(id) => (
                    <div className="d-flex align-items-baseline">
                        <DateInputNoPicker
                            id={id}
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
                )}
            </TestFormGroup>
            <TestFormGroup
                label="Filter dates, only allows weekends to be selected"
                valid={fieldValidity.dateInput9}
            >
                {(id) => (
                    <DateInput
                        id={id}
                        name="dateInput9"
                        timeZone="local"
                        value={dateInput9Value}
                        onChange={setDateInput9Value}
                        filterDate={(date) => isWeekend(date)}
                        includesTime
                        validators={[]}
                        {...vProps}
                    />
                )}
            </TestFormGroup>
        </div>
    )
}
