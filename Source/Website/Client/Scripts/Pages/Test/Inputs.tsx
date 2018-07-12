import * as React from 'react'
import * as moment from 'moment'
import { sortBy } from 'lodash'
import { IPageProps } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components/Header'
import {
    PhoneInput,
    Validators,
    TimeInput,
    requiredTimeValidator,
    requiredDateValidator,
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
    ValidatedMultiSelect
} from '@interface-technologies/iti-react'

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
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Phone Input</h5>
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
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Time Input</h5>
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
                            validators={[requiredTimeValidator()]}
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

        return (
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Date Input</h5>
                    <div className="form-group">
                        <label>Not required</label>{' '}
                        <ValidityLabel valid={fieldValidity.dateInput0} />
                        <DateInput
                            name="dateInput0"
                            showValidation={showValidation}
                            validators={[]}
                            onValidChange={this.childValidChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Required</label>{' '}
                        <ValidityLabel valid={fieldValidity.dateInput1} />
                        <DateInput
                            name="dateInput1"
                            showValidation={showValidation}
                            validators={[requiredDateValidator()]}
                            onValidChange={this.childValidChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Controlled</label>{' '}
                        <ValidityLabel valid={fieldValidity.dateInput2} />
                        <div className="d-flex" style={{ alignItems: 'flex-start' }}>
                            <div className="mr-4">
                                <DateInput
                                    name="dateInput2"
                                    value={dateInput2Value}
                                    onChange={dateInput2Value =>
                                        this.setState({ dateInput2Value })
                                    }
                                    showValidation={showValidation}
                                    validators={[]}
                                    onValidChange={this.childValidChange}
                                />
                            </div>
                            <button
                                className="btn btn-secondary mr-2"
                                onClick={() =>
                                    this.setState({
                                        dateInput2Value: {
                                            moment: undefined,
                                            raw: ''
                                        }
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
            <div className="card mb-4 select-section">
                <div className="card-body">
                    <h5 className="card-title">React Select</h5>
                    <div className="form-group">
                        <label>Not required & show validation = false</label>{' '}
                        <ValidityLabel valid={fieldValidity.select0} />
                        <ValidatedSelect
                            name="select0"
                            className="test"
                            options={SelectSection.colorOptions}
                            showValidation={false}
                            validators={[]}
                            onValidChange={this.childValidChange}
                            isClearable
                        />
                    </div>
                    <div className="form-group">
                        <label>Required and controlled</label>{' '}
                        <ValidityLabel valid={fieldValidity.select1} />
                        <ValidatedSelect
                            name="select1"
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
                        <ValidatedMultiSelect
                            name="select3"
                            className="test"
                            options={SelectSection.groupedOptions}
                            value={selectValue3}
                            onChange={selectValue3 => this.setState({ selectValue3 })}
                            showValidation={showValidation}
                            validators={[]}
                            onValidChange={this.childValidChange}
                            isClearable
                        />
                    </div>
                    <div className="form-group">
                        <label>Required multi select</label>{' '}
                        <ValidityLabel valid={fieldValidity.select4} />
                        <ValidatedMultiSelect
                            name="select4"
                            className="test"
                            options={SelectSection.groupedOptions}
                            value={selectValue4}
                            onChange={selectValue4 => this.setState({ selectValue4 })}
                            showValidation={showValidation}
                            validators={[MultiSelectValidators.required()]}
                            onValidChange={this.childValidChange}
                            isClearable
                        />
                    </div>
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
            pageId: 'page-home-inputs'
        })
    }

    childValidChange = (fieldName: string, valid: boolean) => {
        childValidChange(fieldName, valid, f => this.setState(f))
    }

    render() {
        if (!this.props.ready) return null

        const { fieldValidity } = this.state

        const showValidation = true

        return (
            <div>
                <PhoneInputSection showValidation={showValidation} />
                <TimeInputSection showValidation={showValidation} />
                <DateInputSection showValidation={showValidation} />
                <SelectSection showValidation={showValidation} />
            </div>
        )
    }
}
