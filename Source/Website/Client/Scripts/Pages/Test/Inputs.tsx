import * as React from 'react'
import * as moment from 'moment'
import { sortBy, range } from 'lodash'
import { IPageProps } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components/Header'
import {
    PhoneInput,
    Validators,
    TimeInput,
    TimeValidators,
    DateValidators,
    DateInputValue,
    dateInputFormat as dateFormat,
    IFieldValidity,
    childValidChange,
    DateInput,
    TimeInputValue,
    timeInputValueFromMoment,
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
    IRadioOption,
    BooleanRadioInput,
    BooleanRadioValidators,
    TimeZoneValidators,
    TimeZoneInput,
    TimeZoneInputValue,
    AddressInput,
    AddressValidators,
    AddressInputValue,
    defaultAddressInputValue
} from '@interface-technologies/iti-react'
import { TabLayout, ITab, getTabFromLocation } from 'Components/TabLayout'

interface IPhoneInputSectionProps extends React.Props<any> {
    showValidation: boolean
}

interface IPhoneInputSectionState {
    fieldValidity: IFieldValidity
}

class PhoneInputSection extends React.Component<
    IPhoneInputSectionProps,
    IPhoneInputSectionState
> {
    state: IPhoneInputSectionState = { fieldValidity: {} }

    childValidChange = (fieldName: string, valid: boolean) => {
        childValidChange(fieldName, valid, f => this.setState(f))
    }

    render() {
        const { showValidation } = this.props
        const { fieldValidity } = this.state

        const vProps = {
            showValidation,
            onValidChange: this.childValidChange
        }

        return (
            <div>
                <div className="form-group">
                    <label>Not required</label>{' '}
                    <ValidityLabel valid={fieldValidity.phoneInput0} />
                    <PhoneInput
                        name="phoneInput0"
                        defaultValue=""
                        validators={[]}
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label>Required</label>{' '}
                    <ValidityLabel valid={fieldValidity.phoneInput1} />
                    <PhoneInput
                        name="phoneInput1"
                        defaultValue=""
                        validators={[Validators.required()]}
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label>Invalid default value</label>{' '}
                    <ValidityLabel valid={fieldValidity.phoneInput2} />
                    <PhoneInput
                        name="phoneInput2"
                        defaultValue="(919)555-271"
                        validators={[]}
                        {...vProps}
                    />
                </div>
            </div>
        )
    }
}

interface ITimeInputSectionProps extends React.Props<any> {
    showValidation: boolean
}

interface ITimeInputSectionState {
    fieldValidity: IFieldValidity
    value2: TimeInputValue
}

class TimeInputSection extends React.Component<
    ITimeInputSectionProps,
    ITimeInputSectionState
> {
    state: ITimeInputSectionState = {
        fieldValidity: {},
        value2: timeInputValueFromMoment(moment().minutes(15))
    }

    childValidChange = (fieldName: string, valid: boolean) => {
        childValidChange(fieldName, valid, f => this.setState(f))
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
                    <TimeInput
                        individualInputsRequired={false}
                        name="timeInput2"
                        validators={[]}
                        value={value2}
                        onChange={value2 => this.setState({ value2 })}
                        {...vProps}
                    />
                </div>
            </div>
        )
    }
}

interface ITimeZoneInputSectionProps extends React.Props<any> {
    showValidation: boolean
}

interface ITimeZoneInputSectionState {
    fieldValidity: IFieldValidity
    value0: TimeZoneInputValue
}

class TimeZoneInputSection extends React.Component<
    ITimeZoneInputSectionProps,
    ITimeZoneInputSectionState
> {
    state: ITimeZoneInputSectionState = {
        fieldValidity: {},
        value0: null
    }

    childValidChange = (fieldName: string, valid: boolean) => {
        childValidChange(fieldName, valid, f => this.setState(f))
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
                    <label>Required</label>{' '}
                    <ValidityLabel valid={fieldValidity.timeZoneInput1} />
                    <TimeZoneInput
                        name="timeZoneInput1"
                        validators={[TimeZoneValidators.required()]}
                        {...vProps}
                    />
                </div>
            </div>
        )
    }
}

interface IDateInputSectionProps extends React.Props<any> {
    showValidation: boolean
}

interface IDateInputSectionState {
    dateInput2Value: DateInputValue
    fieldValidity: IFieldValidity
}

class DateInputSection extends React.Component<
    IDateInputSectionProps,
    IDateInputSectionState
> {
    state: IDateInputSectionState = {
        fieldValidity: {},
        dateInput2Value: defaultDateInputValue
    }

    childValidChange = (fieldName: string, valid: boolean) => {
        childValidChange(fieldName, valid, f => this.setState(f))
    }

    render() {
        const { showValidation } = this.props
        const { fieldValidity, dateInput2Value } = this.state

        const vProps = { showValidation, onValidChange: this.childValidChange }

        return (
            <div>
                <div className="form-group">
                    <label>Not required</label>{' '}
                    <ValidityLabel valid={fieldValidity.dateInput0} />
                    <DateInput name="dateInput0" validators={[]} {...vProps} />
                </div>
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
                                    dateInput2Value: dateInputValueFromMoment(m)
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
                        validators={[DateValidators.required()]}
                        showTimeSelect
                        timeIntervals={10}
                        {...vProps}
                    />
                </div>
            </div>
        )
    }
}

interface ISelectSectionProps extends React.Props<any> {
    showValidation: boolean
}

interface ISelectSectionState {
    selectValue: SelectValue
    selectValue2: SelectValue
    selectValue3: MultiSelectValue
    selectValue4: MultiSelectValue
    fieldValidity: IFieldValidity
}

class SelectSection extends React.Component<ISelectSectionProps, ISelectSectionState> {
    state: ISelectSectionState = {
        fieldValidity: {},
        selectValue: null,
        selectValue2: null,
        selectValue3: [],
        selectValue4: []
    }

    static colorOptions = [
        { value: 'ocean', label: 'Ocean', color: '#00B8D9' },
        { value: 'blue', label: 'Blue', color: '#0052CC', disabled: true },
        { value: 'purple', label: 'Purple', color: '#5243AA' },
        { value: 'red', label: 'Red', color: '#FF5630' },
        { value: 'orange', label: 'Orange', color: '#FF8B00' },
        { value: 'yellow', label: 'Yellow', color: '#FFC400' },
        { value: 'green', label: 'Green', color: '#36B37E' },
        { value: 'forest', label: 'Forest', color: '#00875A' },
        { value: 'slate', label: 'Slate', color: '#253858' },
        { value: 'silver', label: 'Silver', color: '#666666' }
    ]

    static flavorOptions = [
        { value: 'vanilla', label: 'Vanilla' },
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'salted-caramel', label: 'Salted Caramel' }
    ]

    static groupedOptions = [
        {
            label: 'Colours',
            options: SelectSection.colorOptions
        },
        {
            label: 'Flavours',
            options: SelectSection.flavorOptions
        }
    ]

    childValidChange = (fieldName: string, valid: boolean) => {
        childValidChange(fieldName, valid, f => this.setState(f))
    }

    render() {
        const { showValidation } = this.props
        const {
            fieldValidity,
            selectValue,
            selectValue2,
            selectValue3,
            selectValue4
        } = this.state

        return (
            <div className="select-section">
                <div className="form-group">
                    <label>Not required & show validation = false</label>{' '}
                    <ValidityLabel valid={fieldValidity.select0} />
                    <div className="d-flex" style={{ width: 600 }}>
                        {/* Don't set className because we want to test setting width via the prop. */}
                        <ValidatedSelect
                            name="select0"
                            options={SelectSection.colorOptions}
                            width={200}
                            showValidation={false}
                            validators={[]}
                            onValidChange={this.childValidChange}
                            isClearable
                        />
                        <select className="ml-2 form-control">
                            <option>Border color / width test</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label>Required and controlled</label>{' '}
                    <ValidityLabel valid={fieldValidity.select1} />
                    <ValidatedSelect
                        name="select1"
                        className="react-select"
                        options={SelectSection.colorOptions}
                        value={selectValue}
                        onChange={selectValue => this.setState({ selectValue })}
                        showValidation={showValidation}
                        validators={[SelectValidators.required()]}
                        onValidChange={this.childValidChange}
                        isClearable
                    />
                </div>
                <div className="form-group">
                    <label>Controlled with grouped options</label>{' '}
                    <ValidityLabel valid={fieldValidity.select2} />
                    <ValidatedSelect
                        name="select2"
                        className="react-select"
                        options={SelectSection.groupedOptions}
                        value={selectValue2}
                        onChange={selectValue2 => this.setState({ selectValue2 })}
                        showValidation={showValidation}
                        validators={[SelectValidators.required()]}
                        onValidChange={this.childValidChange}
                        isClearable
                    />
                </div>
                <div className="form-group">
                    <label>Multi select</label>{' '}
                    <ValidityLabel valid={fieldValidity.select3} />
                    <div className="d-flex" style={{ width: 600 }}>
                        <ValidatedMultiSelect
                            name="select3"
                            width={350}
                            options={SelectSection.groupedOptions}
                            value={selectValue3}
                            onChange={selectValue3 => this.setState({ selectValue3 })}
                            showValidation={showValidation}
                            validators={[]}
                            onValidChange={this.childValidChange}
                            isClearable
                        />
                        <select className="ml-2 form-control">
                            <option>Width test</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label>Required multi select</label>{' '}
                    <ValidityLabel valid={fieldValidity.select4} />
                    <ValidatedMultiSelect
                        name="select4"
                        className="react-select"
                        options={SelectSection.groupedOptions}
                        value={selectValue4}
                        onChange={selectValue4 => this.setState({ selectValue4 })}
                        showValidation={showValidation}
                        validators={[MultiSelectValidators.required()]}
                        onValidChange={this.childValidChange}
                        isClearable
                    />
                </div>
                <div className="form-group">
                    <label>Test 0 as a value</label>{' '}
                    <ValidityLabel valid={fieldValidity.select5} />
                    <ValidatedSelect
                        name="select5"
                        className="react-select"
                        options={[
                            { value: 0, label: '0' },
                            { value: 1, label: '1' },
                            { value: 2, label: '2' }
                        ]}
                        showValidation={showValidation}
                        validators={[]}
                        onValidChange={this.childValidChange}
                        isClearable
                    />
                </div>
            </div>
        )
    }
}

enum Color {
    Red,
    Blue,
    Green,
    Yellow
}

interface IRadioInputSectionProps extends React.Props<any> {
    showValidation: boolean
}

interface IRadioInputSectionState {
    fieldValidity: IFieldValidity
    value1: Color | null
}

class RadioInputSection extends React.Component<
    IRadioInputSectionProps,
    IRadioInputSectionState
> {
    options: IRadioOption[]

    constructor(props: IRadioInputSectionProps) {
        super(props)

        this.options = [
            { value: Color.Red, label: 'Red' },
            { value: Color.Blue, label: 'Blue' },
            { value: Color.Green, label: 'Green' },
            { value: Color.Yellow, label: 'Yellow' }
        ]
    }

    state: IRadioInputSectionState = { fieldValidity: {}, value1: null }

    childValidChange = (fieldName: string, valid: boolean) => {
        childValidChange(fieldName, valid, f => this.setState(f))
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

interface IAddressInputSectionProps extends React.Props<any> {
    showValidation: boolean
}

interface IAddressInputSectionState {
    fieldValidity: IFieldValidity
    value1: AddressInputValue
}

class AddressInputSection extends React.Component<
    IAddressInputSectionProps,
    IAddressInputSectionState
> {
    state: IAddressInputSectionState = {
        fieldValidity: {},
        value1: defaultAddressInputValue
    }

    childValidChange = (fieldName: string, valid: boolean) => {
        childValidChange(fieldName, valid, f => this.setState(f))
    }

    render() {
        const { showValidation } = this.props
        const { fieldValidity, value1 } = this.state

        const vProps = {
            showValidation,
            onValidChange: this.childValidChange
        }

        return (
            <div className="address-input-section">
                <div className="form-group checkbox-form-group">
                    <label>Not required</label>{' '}
                    <ValidityLabel valid={fieldValidity.addressInput0} />
                    <AddressInput name="addressInput0" validators={[]} {...vProps} />
                </div>
                <div className="form-group checkbox-form-group">
                    <label>Required & controlled</label>{' '}
                    <ValidityLabel valid={fieldValidity.addressInput1} />
                    <AddressInput
                        name="addressInput1"
                        value={value1}
                        onChange={value1 => this.setState({ value1 })}
                        validators={[AddressValidators.required()]}
                        individualInputsRequired={true}
                        {...vProps}
                    />
                </div>
            </div>
        )
    }
}

interface IValidityLabelProps extends React.Props<any> {
    valid?: boolean
}

function ValidityLabel(props: IValidityLabelProps) {
    return <span className="validity-label">{props.valid ? 'VALID' : 'INVALID'}</span>
}

const tabs: ITab[] = [
    {
        name: 'phone',
        displayName: 'Phone'
    },
    {
        name: 'time',
        displayName: 'Time'
    },
    {
        name: 'date',
        displayName: 'Date'
    },
    {
        name: 'timeZone',
        displayName: 'Time Zone'
    },
    {
        name: 'select',
        displayName: 'Select'
    },
    {
        name: 'radio',
        displayName: 'Radio'
    },
    {
        name: 'address',
        displayName: 'Address'
    }
]

interface IPageState {
    fieldValidity: IFieldValidity
}

export class Page extends React.Component<IPageProps, IPageState> {
    state: IPageState = {
        fieldValidity: {}
    }

    componentDidMount() {
        const { onReady } = this.props

        onReady({
            title: 'Input Test',
            activeNavbarLink: NavbarLink.Index,
            pageId: 'page-test-inputs'
        })
    }

    childValidChange = (fieldName: string, valid: boolean) => {
        childValidChange(fieldName, valid, f => this.setState(f))
    }

    render() {
        if (!this.props.ready) return null

        const { location } = this.props
        const { fieldValidity } = this.state

        const showValidation = true
        const tab = getTabFromLocation(tabs, location)

        return (
            <div>
                <h3 className="mb-3">Inputs</h3>
                <TabLayout tabs={tabs} current={tab}>
                    <form id="inputs-form">
                        {tab === 'phone' && (
                            <PhoneInputSection showValidation={showValidation} />
                        )}
                        {tab === 'time' && (
                            <TimeInputSection showValidation={showValidation} />
                        )}
                        {tab === 'date' && (
                            <DateInputSection showValidation={showValidation} />
                        )}
                        {tab === 'timeZone' && (
                            <TimeZoneInputSection showValidation={showValidation} />
                        )}
                        {tab === 'select' && (
                            <SelectSection showValidation={showValidation} />
                        )}
                        {tab === 'radio' && (
                            <RadioInputSection showValidation={showValidation} />
                        )}
                        {tab === 'address' && (
                            <AddressInputSection showValidation={showValidation} />
                        )}
                    </form>
                </TabLayout>
            </div>
        )
    }
}
