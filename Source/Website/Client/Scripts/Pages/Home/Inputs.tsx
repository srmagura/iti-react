import * as React from 'react';

import { IPageProps } from 'Components/Routing/RouteProps';
import { NavbarLink } from 'Components/Header';
import {
    PhoneInput, Validators, TimeInput, requiredTimeValidator,
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
}

export class Page extends React.Component<IPageProps, IPageState> {

    state: IPageState = {
        fieldValidity: {
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

        const { fieldValidity } = this.state

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
                            onValidChange={valid => this.childValidChange('phoneInput0', valid)}/>
                    </div>
                    <div className="form-group">
                        <label>Required</label>{' '}<ValidityLabel valid={fieldValidity.phoneInput1} />
                        <PhoneInput
                            name="phoneInput1"
                            defaultValue=""
                            showValidation={showValidation}
                            validators={[Validators.required()]}
                            onValidChange={valid => this.childValidChange('phoneInput1', valid)}/>
                    </div>
                    <div className="form-group">
                        <label>Invalid default value</label>{' '}<ValidityLabel valid={fieldValidity.phoneInput2} />
                        <PhoneInput
                            name="phoneInput2"
                            defaultValue="(919)555-271"
                            showValidation={showValidation}
                            validators={[]}
                            onValidChange={valid => this.childValidChange('phoneInput2', valid)}/>
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
                            onValidChange={valid => this.childValidChange('timeInput0', valid)}/>
                    </div>
                    <div className="form-group">
                        <label>Required</label>{' '}<ValidityLabel valid={fieldValidity.timeInput1} />
                        <TimeInput
                            name="timeInput1"
                            showValidation={showValidation}
                            individualInputsRequired={true}
                            validators={[requiredTimeValidator()]}
                            onValidChange={valid => this.childValidChange('timeInput1', valid)}/>
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
                                   onValidChange={valid => this.childValidChange('dateInput0', valid)} />
                           </div>
                           <div className="form-group">
                               <label>Required</label>{' '}<ValidityLabel valid={fieldValidity.dateInput1} />
                               <DateInput
                                   name="dateInput1"
                                   showValidation={showValidation}
                                   validators={[/*requiredTimeValidator()*/]}
                                   onValidChange={valid => this.childValidChange('dateInput1', valid)} />
                           </div>
                       </div>
                   </div>
        </div>
    }
}


