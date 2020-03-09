import React, { useState } from 'react'
import {
    FieldValidity,
    AddressInput,
    AddressValidators,
    AddressInputValue,
    defaultAddressInputValue,
    getSelectStyles,    useFieldValidity
} from '@interface-technologies/iti-react'
import { ValidityLabel } from './ValidityLabel'

interface AddressInputSectionProps {
    showValidation: boolean
}


export function AddressInputSection(props: AddressInputSectionProps) {
    const { showValidation } = props

    const [onChildValidChange, fieldValidity] = useFieldValidity()
    const vProps = {showValidation,onValidChange:onChildValidChange}

    const [value1, setValue1] = useState<AddressInputValue>({
        ...defaultAddressInputValue,
        state: 'va' // testing that state is case-insenstive
    })


        return (
            <div className="address-input-section">
                <div className="form-group checkbox-form-group">
                    <label>Not required</label>{' '}
                    <ValidityLabel valid={fieldValidity.addressInput0} />
                    <AddressInput
                        name="addressInput0"
                        individualInputsRequired={false}
                        validators={[]}
                        {...vProps}
                    />
                </div>
                <div className="form-group checkbox-form-group">
                    <label>Required & controlled with custom select style</label>{' '}
                    <ValidityLabel valid={fieldValidity.addressInput1} />
                    <AddressInput
                        name="addressInput1"
                        value={value1}
                        onChange={setValue1}
                        validators={[AddressValidators.required()]}
                        individualInputsRequired={true}
                        getStateSelectStyles={options => {
                            const defaultStyles = getSelectStyles(options)

                            return {
                                ...defaultStyles,
                                control: (base: any, state: any) => ({
                                    ...defaultStyles.control(base, state),
                                    backgroundColor: 'orchid'
                                })
                            }
                        }}
                        {...vProps}
                    />
                </div>
                <div className="form-group checkbox-form-group">
                    <label>Disabled</label>{' '}
                    <ValidityLabel valid={fieldValidity.addressInput2} />
                    <AddressInput
                        name="addressInput2"
                        enabled={false}
                        individualInputsRequired={false}
                        validators={[]}
                        {...vProps}
                    />
                </div>
                <div className="form-group checkbox-form-group">
                    <label>Allow Canadian addresses</label>{' '}
                    <ValidityLabel valid={fieldValidity.addressInput3} />
                    <AddressInput
                        name="addressInput3"
                        allowCanadian
                        individualInputsRequired={false}
                        validators={[]}
                        {...vProps}
                    />
                </div>
            </div>
        )
    }
