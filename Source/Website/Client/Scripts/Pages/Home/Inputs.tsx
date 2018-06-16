import * as React from 'react'
import * as moment from 'moment'
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
    dateInputValueFromMoment
} from 'iti-react'

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
                        <div
                            className="d-flex"
                            style={{ alignItems: 'flex-start' }}
                        >
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
                                        dateInput2Value: dateInputValueFromMoment(
                                            m
                                        )
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

interface IValidityLabelProps extends React.Props<any> {
    valid?: boolean
}

function ValidityLabel(props: IValidityLabelProps) {
    return (
        <span className="validity-label">
            {props.valid ? 'VALID' : 'INVALID'}
        </span>
    )
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
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Phone Input</h5>
                        <div className="form-group">
                            <label>Not required</label>{' '}
                            <ValidityLabel valid={fieldValidity.phoneInput0} />
                            <PhoneInput
                                name="phoneInput0"
                                defaultValue=""
                                showValidation={showValidation}
                                validators={[]}
                                onValidChange={this.childValidChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Required</label>{' '}
                            <ValidityLabel valid={fieldValidity.phoneInput1} />
                            <PhoneInput
                                name="phoneInput1"
                                defaultValue=""
                                showValidation={showValidation}
                                validators={[Validators.required()]}
                                onValidChange={this.childValidChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Invalid default value</label>{' '}
                            <ValidityLabel valid={fieldValidity.phoneInput2} />
                            <PhoneInput
                                name="phoneInput2"
                                defaultValue="(919)555-271"
                                showValidation={showValidation}
                                validators={[]}
                                onValidChange={this.childValidChange}
                            />
                        </div>
                    </div>
                </div>
                <TimeInputSection showValidation={showValidation} />
                <DateInputSection showValidation={showValidation} />
            </div>
        )
    }
}
