import * as React from 'react'
import * as moment from 'moment'
import { sortBy, range } from 'lodash'
import { PageProps } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components/Header'
import {
    PhoneInput,
    Validators,
    TimeInput,
    TimeValidators,
    DateValidators,
    DateInputValue,
    dateInputFormat as dateFormat,
    FieldValidity,
    childValidChange,
    DateInput,
    TimeInputValue,
    defaultDateInputValue,
    dateInputValueFromMoment,
    ValidatedSelect,
    SelectValue,
    SelectValidators,
    MultiSelectValue,
    MultiSelectValidators,
    ValidatedMultiSelect,
    RadioInput,
    RadioValidators,
    RadioOption,
    BooleanRadioInput,
    BooleanRadioValidators,
    TimeZoneValidators,
    TimeZoneInput,
    TimeZoneInputValue,
    AddressInput,
    AddressValidators,
    AddressInputValue,
    defaultAddressInputValue,
    ValidatedInput,
    timeInputValueToDecimalHours
} from '@interface-technologies/iti-react'
import { TabLayout, Tab, getTabFromLocation } from 'Components/TabLayout'
import { ValidityLabel } from './ValidityLabel'

enum Color {
    Red,
    Blue,
    Green,
    Yellow
}

interface RadioInputSectionProps extends React.Props<any> {
    showValidation: boolean
}

interface RadioInputSectionState {
    fieldValidity: FieldValidity
    value1: Color | null
}

export class RadioInputSection extends React.Component<
    RadioInputSectionProps,
    RadioInputSectionState
> {
    options: RadioOption[]

    constructor(props: RadioInputSectionProps) {
        super(props)

        this.options = [
            { value: Color.Red, label: 'Red' },
            { value: Color.Blue, label: 'Blue' },
            { value: Color.Green, label: 'Green' },
            { value: Color.Yellow, label: 'Yellow' }
        ]
    }

    state: RadioInputSectionState = { fieldValidity: {}, value1: null }

    childValidChange = (fieldName: string, valid: boolean) => {
        childValidChange(fieldName, valid, x => this.setState(...x))
    }

    render() {
        const { showValidation } = this.props
        const { fieldValidity, value1 } = this.state

        const vProps = {
            showValidation,
            onValidChange: this.childValidChange
        }

        return (
            <div>
                <div className="form-group checkbox-form-group">
                    <label>Not required</label>{' '}
                    <ValidityLabel valid={fieldValidity.radioInput0} />
                    <RadioInput
                        name="radioInput0"
                        defaultValue={null}
                        options={this.options}
                        validators={[]}
                        {...vProps}
                    />
                </div>
                <div className="form-group checkbox-form-group">
                    <label>Required & controlled</label>{' '}
                    <ValidityLabel valid={fieldValidity.radioInput1} />
                    <RadioInput
                        name="radioInput1"
                        value={value1}
                        onChange={value1 => this.setState({ value1: value1 as number })}
                        options={this.options}
                        validators={[RadioValidators.required()]}
                        {...vProps}
                    />
                </div>
                <div className="form-group checkbox-form-group">
                    <label>Boolean & required</label>{' '}
                    <ValidityLabel valid={fieldValidity.radioInput2} />
                    <BooleanRadioInput
                        name="radioInput2"
                        defaultValue={null}
                        validators={[BooleanRadioValidators.required()]}
                        {...vProps}
                    />
                </div>
                <div className="form-group checkbox-form-group">
                    <label>Boolean with different labels and with styling</label>{' '}
                    <ValidityLabel valid={fieldValidity.radioInput3} />
                    <div className="styled-radio-input">
                        <BooleanRadioInput
                            name="radioInput3"
                            defaultValue={null}
                            labels={{ true: 'Enabled', false: 'Disabled' }}
                            validators={[]}
                            {...vProps}
                        />
                    </div>
                </div>
                <div className="form-group checkbox-form-group">
                    <label>Test of display: grid</label>{' '}
                    <ValidityLabel valid={fieldValidity.gridRadioInput} />
                    <RadioInput
                        name="gridRadioInput"
                        defaultValue={null}
                        options={range(20).map(i => ({
                            value: i,
                            label: i.toString()
                        }))}
                        validators={[]}
                        {...vProps}
                    />
                </div>
            </div>
        )
    }
}
