import React from 'react'
import {
    FieldValidity,
    childValidChange,
    TimeZoneValidators,
    TimeZoneInput,
    TimeZoneInputValue
} from '@interface-technologies/iti-react'
import { ValidityLabel } from './ValidityLabel'
import { FormGroup } from 'Components/FormGroup'

interface TimeZoneInputSectionProps {
    showValidation: boolean
}

interface TimeZoneInputSectionState {
    fieldValidity: FieldValidity
    value0: TimeZoneInputValue
}

export class TimeZoneInputSection extends React.Component<
    TimeZoneInputSectionProps,
    TimeZoneInputSectionState
> {
    state: TimeZoneInputSectionState = {
        fieldValidity: {},
        value0: null
    }

    childValidChange = (fieldName: string, valid: boolean) => {
        childValidChange(fieldName, valid, x => this.setState(...x))
    }

    render() {
        const { showValidation } = this.props
        const { fieldValidity, value0 } = this.state

        const vProps = {
            showValidation,
            onValidChange: this.childValidChange
        }

        return (
            <div className="form-limit-width">
                <FormGroup
                    label={
                        <span>
                            Not required & controlled{' '}
                            <ValidityLabel valid={fieldValidity.timeZoneInput0} />
                        </span>
                    }
                >
                    {id => (
                        <TimeZoneInput
                            id={id}
                            name="timeZoneInput0"
                            value={value0}
                            onChange={value0 => this.setState({ value0 })}
                            placeholder="Select time zone..."
                            isClearable
                            validators={[]}
                            {...vProps}
                        />
                    )}
                </FormGroup>
                <div className="form-group">
                    <label>Required & in flexbox</label>{' '}
                    <ValidityLabel valid={fieldValidity.timeZoneInput1} />
                    <div className="d-flex">
                        <TimeZoneInput
                            name="timeZoneInput1"
                            validators={[TimeZoneValidators.required()]}
                            {...vProps}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
