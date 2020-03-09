import React, { useState } from 'react'
import moment from 'moment-timezone'
import {
    DateValidators,
    DateInputValue,
    FieldValidity,
    DateInput,
    defaultDateInputValue,
    dateInputValueFromMoment,
    useFieldValidity
} from '@interface-technologies/iti-react'
import { ValidityLabel } from './ValidityLabel'
import { FormGroup } from 'Components/FormGroup'

interface DateInputSectionProps {
    showValidation: boolean
}

interface DateInputSectionState {
    fieldValidity: FieldValidity
    dateInput2Value: DateInputValue
    dateInput7Value: DateInputValue
    dateInput8Value: DateInputValue
}

export function DateInputSection(props:DateInputSectionProps) {
    const { showValidation } = props

    const [onChildValidChange, fieldValidity] = useFieldValidity()
    const vProps = {showValidation,onChildValidChange}

    const [dateInput2Value, setDateInput2Value] = useState<DateInputValue>(defaultDateInputValue)
    const [dateInput7Value, setDateInput7Value] = useState<DateInputValue>(dateInputValueFromMoment(moment(), {
        includesTime: true,
        timeZone: 'America/Los_Angeles'
    }))
        const [dateInput8Value, setDateInput8Value] = useState<DateInputValue>(dateInputValueFromMoment(moment(), {
            includesTime: true,
            timeZone: 'America/Los_Angeles'
        }))


        return (
            <div>
                <FormGroup
                    label={
                        <span>
                            Not required{' '}
                            <ValidityLabel valid={fieldValidity.dateInput0} />
                        </span>
                    }
                >
                    {id => (
                        <DateInput
                            id={id}
                            name="dateInput0"
                            timeZone="local"
                            validators={[]}
                            {...vProps}
                        />
                    )}
                </FormGroup>
                <div className="form-group">
                    <label>Required</label>{' '}
                    <ValidityLabel valid={fieldValidity.dateInput1} />
                    <DateInput
                        name="dateInput1"
                        timeZone="local"
                        validators={[DateValidators.required()]}
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label>Controlled</label>{' '}
                    <ValidityLabel valid={fieldValidity.dateInput2} />
                    <div className="d-flex" style={{ alignItems: 'flex-start' }}>
                        <div className="mr-2">
                            <DateInput
                                name="dateInput2"
                                timeZone="local"
                                value={dateInput2Value}
                                onChange={setDateInput2Value}
                                validators={[]}
                                {...vProps}
                            />
                        </div>
                        <button
                            className="btn btn-secondary mr-2"
                            onClick={() =>
                                setDateInput2Value(defaultDateInputValue)
                            }
                        >
                            Clear
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                const m = moment('2001-01-01T10:00:00.000Z')
                                setDateInput2Value( dateInputValueFromMoment(m, {
                                        includesTime: false,
                                        timeZone: 'local'
                                    })
                                )
                            }}
                        >
                            Set to 1/1/2001
                        </button>
                    </div>
                </div>
                <div className="form-group">
                    <label>Date & time selection</label>{' '}
                    <ValidityLabel valid={fieldValidity.dateInput3} />
                    <DateInput
                        name="dateInput3"
                        timeZone="local"
                        validators={[DateValidators.required({ includesTime: true })]}
                        includesTime
                        timeIntervals={10}
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label>No datepicker</label>{' '}
                    <ValidityLabel valid={fieldValidity.dateInput4} />
                    <DateInput
                        name="dateInput4"
                        timeZone="local"
                        validators={[DateValidators.required({ includesTime: true })]}
                        showPicker={false}
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label>Readonly</label>{' '}
                    <ValidityLabel valid={fieldValidity.dateInput5} />
                    <DateInput
                        name="dateInput5"
                        timeZone="local"
                        readOnly
                        defaultValue={dateInputValueFromMoment(moment(), {
                            includesTime: false,
                            timeZone: 'local'
                        })}
                        validators={[]}
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label>
                        Pacific time (uncontrolled), defaults to the current time
                    </label>{' '}
                    <ValidityLabel valid={fieldValidity.dateInput6} />
                    <div className="d-flex align-items-baseline">
                        <DateInput
                            name="dateInput6"
                            timeZone="America/Los_Angeles"
                            defaultValue={dateInputValueFromMoment(moment(), {
                                includesTime: true,
                                timeZone: 'America/Los_Angeles'
                            })}
                            includesTime
                            validators={[]}
                            {...vProps}
                        />
                        <div className="ml-3 mr-5">Pacific</div>
                    </div>
                </div>
                <div className="form-group">
                    <label>Pacific time (controlled), defaults to the current time</label>{' '}
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
                        <div className="ml-3 mr-5">Pacific</div>
                        <div>
                            UTC:{' '}
                            <b>
                                {dateInput7Value.moment &&
                                    dateInput7Value.moment.utc().format('M/D/YYYY H:mm')}
                            </b>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label>
                        Pacific time (controlled), no picker, defaults to the current time
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
                        <div className="ml-3 mr-5">Pacific</div>
                        <div>
                            UTC:{' '}
                            <b>
                                {dateInput8Value.moment &&
                                    dateInput8Value.moment.utc().format('M/D/YYYY H:mm')}
                            </b>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
