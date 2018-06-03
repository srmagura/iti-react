import * as React from 'react';
import * as moment from 'moment';
import { IPageProps } from 'Components/Routing/RouteProps';
import { NavbarLink } from 'Components/Header';
import {
    PhoneInput, Validators, TimeInput, requiredTimeValidator,
    requiredDateValidator, DateInputValue, dateFormat,
    IFieldValidity, childValidChange, DateInput
} from 'Util/ITIReact';

interface IValidityLabelProps extends React.Props<any> {
    valid?: boolean
}

function ValidityLabel(props: IValidityLabelProps) {
    return <span className="validity-label">{props.valid ? 'VALID' : 'INVALID'}</span>
}

interface IPageState {
    fieldValidity: IFieldValidity
    dateInput2Value: DateInputValue
}

export class Page extends React.Component<IPageProps, IPageState> {

    state: IPageState = {
        fieldValidity: {},
        dateInput2Value: {
            moment: undefined,
            raw: ''
        }
    }

    componentDidMount() {
        const { onReady } = this.props

        onReady({
            title: 'Input Test',
            activeNavbarLink: NavbarLink.Index,
            pageId: 'page-home-inputs'
        })
    }

    childValidChange(fieldName: string, valid: boolean) {
        childValidChange(fieldName, valid, f => this.setState(f))
    }

    render() {
        if (!this.props.ready) return null

        const { fieldValidity, dateInput2Value } = this.state

        const showValidation = true

        return <div>
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Phone Input</h5>
                    <div className="form-group">
                        <label>Not required</label>{' '}<ValidityLabel valid={fieldValidity.phoneInput0} />
                        <PhoneInput
                            name="phoneInput0"
                            defaultValue=""
                            showValidation={showValidation}
                            validators={[]}
                            onValidChange={this.childValidChange} />
                    </div>
                    <div className="form-group">
                        <label>Required</label>{' '}<ValidityLabel valid={fieldValidity.phoneInput1} />
                        <PhoneInput
                            name="phoneInput1"
                            defaultValue=""
                            showValidation={showValidation}
                            validators={[Validators.required()]}
                            onValidChange={this.childValidChange} />
                    </div>
                    <div className="form-group">
                        <label>Invalid default value</label>{' '}<ValidityLabel valid={fieldValidity.phoneInput2} />
                        <PhoneInput
                            name="phoneInput2"
                            defaultValue="(919)555-271"
                            showValidation={showValidation}
                            validators={[]}
                            onValidChange={this.childValidChange} />
                    </div>
                </div>
            </div>
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Time Input</h5>
                    <div className="form-group">
                        <label>Not required</label>{' '}<ValidityLabel valid={fieldValidity.timeInput0} />
                        <TimeInput
                            individualInputsRequired={false}
                            name="timeInput0"
                            showValidation={showValidation}
                            validators={[]}
                            onValidChange={this.childValidChange} />
                    </div>
                    <div className="form-group">
                        <label>Required</label>{' '}<ValidityLabel valid={fieldValidity.timeInput1} />
                        <TimeInput
                            name="timeInput1"
                            showValidation={showValidation}
                            individualInputsRequired={true}
                            validators={[requiredTimeValidator()]}
                            onValidChange={this.childValidChange} />
                    </div>
                </div>
            </div>
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Date Input</h5>
                    <div className="form-group">
                        <label>Not required</label>{' '}<ValidityLabel valid={fieldValidity.dateInput0} />
                        <DateInput
                            name="dateInput0"
                            showValidation={showValidation}
                            validators={[]}
                            onValidChange={this.childValidChange} />
                    </div>
                    <div className="form-group">
                        <label>Required</label>{' '}<ValidityLabel valid={fieldValidity.dateInput1} />
                        <DateInput
                            name="dateInput1"
                            showValidation={showValidation}
                            validators={[requiredDateValidator()]}
                            onValidChange={this.childValidChange} />
                    </div>
                    <div className="form-group">
                        <label>Controlled</label>{' '}<ValidityLabel valid={fieldValidity.dateInput2} />
                        <div className="d-flex">
                            <div className="mr-4">
                                <DateInput
                                    name="dateInput2"
                                    value={dateInput2Value}
                                    onChange={dateInput2Value => this.setState({ dateInput2Value })}
                                    showValidation={showValidation}
                                    validators={[]}
                                    onValidChange={this.childValidChange} />
                            </div>
                            <div className="btn-toolbar">
                                <div className="btn-group mr-2">
                                    <button className="btn btn-secondary"
                                        onClick={() => this.setState({
                                            dateInput2Value: {
                                                moment: undefined,
                                                raw: ''
                                            }
                                        })}>
                                        Clear
                                    </button>
                                </div>
                                <div className="btn-group mr-2">
                                    <button className="btn btn-secondary"
                                        onClick={() => {
                                            const m = moment('2001-01-01T10:00:00.000Z')
                                            this.setState({
                                                dateInput2Value: {
                                                    moment: m,
                                                    raw: m.format(dateFormat)
                                                }
                                            })
                                        }}>
                                        Set to 1/1/2001
                                    </button>
                                </div>
                            </div></div>
                    </div>
                </div>
            </div>
        </div>
    }
}


