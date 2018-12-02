import * as React from 'react'
import * as moment from 'moment'
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
    dateInput2Value: DateInputValue
    fieldValidity: FieldValidity
}

export class DateInputSection extends React.Component<
    DateInputSectionProps,
    DateInputSectionState
> {
    state: DateInputSectionState = {
        fieldValidity: {},
        dateInput2Value: defaultDateInputValue
    }

    childValidChange = (fieldName: string, valid: boolean) => {
        childValidChange(fieldName, valid, x => this.setState(...x))
    }

    render() {
        const { showValidation } = this.props
        const { fieldValidity, dateInput2Value } = this.state

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
                                    dateInput2Value: dateInputValueFromMoment(m, false)
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
                        validators={[DateValidators.required(true)]}
                        showTimeSelect
                        timeIntervals={10}
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label>No datepicker</label>{' '}
                    <ValidityLabel valid={fieldValidity.dateInput4} />
                    <DateInput
                        name="dateInput4"
                        validators={[DateValidators.required(true)]}
                        showPicker={false}
                        {...vProps}
                    />
                </div>
            </div>
        )
    }
}
