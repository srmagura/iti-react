import * as React from 'react'
import {
    PhoneInput,
    Validators,
    FieldValidity,
    childValidChange
} from '@interface-technologies/iti-react'
import { ValidityLabel } from './ValidityLabel'

interface PhoneInputSectionProps extends React.Props<any> {
    showValidation: boolean
}

interface PhoneInputSectionState {
    fieldValidity: FieldValidity
}

export class PhoneInputSection extends React.Component<
    PhoneInputSectionProps,
    PhoneInputSectionState
> {
    state: PhoneInputSectionState = { fieldValidity: {} }

    childValidChange = (fieldName: string, valid: boolean) => {
        childValidChange(fieldName, valid, x => this.setState(...x))
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
