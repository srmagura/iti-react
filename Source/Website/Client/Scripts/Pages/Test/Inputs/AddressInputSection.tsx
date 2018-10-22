import * as React from 'react'
import {
    FieldValidity,
    childValidChange,
    AddressInput,
    AddressValidators,
    AddressInputValue,
    defaultAddressInputValue
} from '@interface-technologies/iti-react'
import { ValidityLabel } from './ValidityLabel'

interface AddressInputSectionProps extends React.Props<any> {
    showValidation: boolean
}

interface AddressInputSectionState {
    fieldValidity: FieldValidity
    value1: AddressInputValue
}

export class AddressInputSection extends React.Component<
    AddressInputSectionProps,
    AddressInputSectionState
> {
    state: AddressInputSectionState = {
        fieldValidity: {},
        value1: {
            ...defaultAddressInputValue,
            state: 'va' // testing that state is case-insenstive
        }
    }

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
