import * as React from 'react'
import {
    TimeInput,
    TimeValidators,
    FieldValidity,
    childValidChange,
    TimeInputValue,
    timeInputValueToDecimalHours
} from '@interface-technologies/iti-react'
import { ValidityLabel } from './ValidityLabel'

interface TimeInputSectionProps extends React.Props<any> {
    showValidation: boolean
}

interface TimeInputSectionState {
    fieldValidity: FieldValidity
    value2: TimeInputValue
}

export class TimeInputSection extends React.Component<
    TimeInputSectionProps,
    TimeInputSectionState
> {
    state: TimeInputSectionState = {
        fieldValidity: {},
        value2: { hours: 12, minutes: 15, ampm: 'pm' }
    }

    childValidChange = (fieldName: string, valid: boolean) => {
        childValidChange(fieldName, valid, x => this.setState(...x))
    }

    render() {
        const { showValidation } = this.props
        const { fieldValidity, value2 } = this.state

        const vProps = {
            showValidation,
            onValidChange: this.childValidChange
        }

        return (
            <div>
                <div className="form-group">
                    <label>Not required</label>{' '}
                    <ValidityLabel valid={fieldValidity.timeInput0} />
                    <TimeInput
                        individualInputsRequired={false}
                        name="timeInput0"
                        validators={[]}
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label>Required</label>{' '}
                    <ValidityLabel valid={fieldValidity.timeInput1} />
                    <TimeInput
                        name="timeInput1"
                        individualInputsRequired={true}
                        validators={[TimeValidators.required()]}
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label>Controlled</label>{' '}
                    <ValidityLabel valid={fieldValidity.timeInput2} />
                    <div className="d-flex align-items-baseline">
                        <TimeInput
                            individualInputsRequired={false}
                            isClearable={false}
                            name="timeInput2"
                            validators={[]}
                            value={value2}
                            onChange={value2 => this.setState({ value2 })}
                            {...vProps}
                        />
                        <div className="ml-4">
                            Decimal hours = {timeInputValueToDecimalHours(value2)}
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label>Disabled</label>{' '}
                    <ValidityLabel valid={fieldValidity.timeInput2} />
                    <TimeInput
                        individualInputsRequired={false}
                        isClearable={true}
                        name="timeInput3"
                        validators={[]}
                        value={{ hours: 5, minutes: 15, ampm: 'pm' }}
                        onChange={() => {}}
                        enabled={false}
                        {...vProps}
                    />
                </div>
            </div>
        )
    }
}
