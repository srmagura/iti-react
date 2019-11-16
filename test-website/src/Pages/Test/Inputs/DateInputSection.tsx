import React from 'react'
import moment from 'moment-timezone'
import {
    DateValidators,
    DateInputValue,
    FieldValidity,
    childValidChange,
    DateInput,
    defaultDateInputValue,
    dateInputValueFromMoment
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

export class DateInputSection extends React.Component<
    DateInputSectionProps,
    DateInputSectionState
> {
    state: DateInputSectionState = {
        fieldValidity: {},
        dateInput2Value: defaultDateInputValue,
        dateInput7Value: dateInputValueFromMoment(moment(), {
            includesTime: true,
            timeZone: 'America/Los_Angeles'
        }),
        dateInput8Value: dateInputValueFromMoment(moment(), {
            includesTime: true,
            timeZone: 'America/Los_Angeles'
        })
    }

    childValidChange = (fieldName: string, valid: boolean) => {
        childValidChange(fieldName, valid, x => this.setState(...x))
    }

    render() {
        const { showValidation } = this.props
        const {
            fieldValidity,
            dateInput2Value,
            dateInput7Value,
            dateInput8Value
        } = this.state

        const vProps = { showValidation, onValidChange: this.childValidChange }

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
                                onChange={dateInput2Value =>
                                    this.setState({ dateInput2Value })
                                }
                                validators={[]}
                                {...vProps}
                            />
                        </div>
                        <button
                            className="btn btn-secondary mr-2"
                            onClick={() =>
                                this.setState({
                                    dateInput2Value: defaultDateInputValue
                                })
                            }
                        >
                            Clear
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                const m = moment('2001-01-01T10:00:00.000Z')
                                this.setState({
                                    dateInput2Value: dateInputValueFromMoment(m, {
                                        includesTime: false,
                                        timeZone: 'local'
                                    })
                                })
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
                            onChange={dateInput7Value =>
                                this.setState({ dateInput7Value })
                            }
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
                            onChange={dateInput8Value =>
                                this.setState({ dateInput8Value })
                            }
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
}
