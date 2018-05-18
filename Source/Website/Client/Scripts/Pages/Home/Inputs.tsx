import * as React from 'react';

import { IPageProps } from 'Components/Routing/RouteProps';
import { NavbarLink } from 'Components/Header';
import { PhoneInput, Validators } from 'Util/ITIReact';

interface IPageState {

}

export class Page extends React.Component<IPageProps, IPageState> {

    state: IPageState = {

    }

    componentDidMount() {
        const { onReady } = this.props

        onReady({
            title: 'Input Test',
            activeNavbarLink: NavbarLink.Index,
            pageId: 'page-home-inputs'
        })
    }

    render() {
        if (!this.props.ready) return null

        const { } = this.state

        const showValidation = true

        return <div>
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Phone Input</h5>
                    <div className="form-group">
                        <label>Not required</label>
                        <PhoneInput
                            name="myPhoneInput0"
                            defaultValue=""
                            showValidation={showValidation}
                            validators={[]} />
                    </div>
                    <div className="form-group">
                        <label>Required</label>
                        <PhoneInput
                            name="myPhoneInput1"
                            defaultValue=""
                            showValidation={showValidation}
                            validators={[ Validators.required() ]} />
                    </div>
                    <div className="form-group">
                        <label>Invalid default value</label>
                        <PhoneInput
                            name="myPhoneInput2"
                            defaultValue="(919)555-271"
                            showValidation={showValidation}
                            validators={[]} />
                    </div>
                </div>
            </div>
        </div>
    }
}


