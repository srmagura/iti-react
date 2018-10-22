import * as React from 'react'
import {
    FieldValidity,
    childValidChange,
    TimeZoneValidators,
    TimeZoneInput,
    TimeZoneInputValue
} from '@interface-technologies/iti-react'
import { ValidityLabel } from './ValidityLabel'

interface TimeZoneInputSectionProps extends React.Props<any> {
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
                <div className="form-group">
                    <label>Not required & controlled</label>{' '}
                    <ValidityLabel valid={fieldValidity.timeZoneInput0} />
                    <TimeZoneInput
                        name="timeZoneInput0"
                        value={value0}
                        onChange={value0 => this.setState({ value0 })}
                        placeholder="Select time zone..."
                        isClearable
                        validators={[]}
                        {...vProps}
                    />
                </div>
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
