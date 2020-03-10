import React from 'react'
import {
    PhoneInput,
    Validators,
    useFieldValidity
} from '@interface-technologies/iti-react'
import { ValidityLabel } from './ValidityLabel'
import { FormGroup } from 'Components/FormGroup'

interface PhoneInputSectionProps {
    showValidation: boolean
}

export function PhoneInputSection(props: PhoneInputSectionProps) {
    const { showValidation } = props

    const [onChildValidChange, fieldValidity] = useFieldValidity()
    const vProps = {
        showValidation,
        onValidChange: onChildValidChange
    }

    return (
        <div>
            <FormGroup
                label={
                    <span>
                        Not required <ValidityLabel valid={fieldValidity.phoneInput0} />
                    </span>
                }
            >
                {id => (
                    <PhoneInput
                        id={id}
                        name="phoneInput0"
                        defaultValue=""
                        validators={[]}
                        {...vProps}
                    />
                )}
            </FormGroup>
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
