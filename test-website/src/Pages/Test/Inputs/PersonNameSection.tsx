import * as React from 'react'
import { useFieldValidity, PersonNameInput } from '@interface-technologies/iti-react'
import { ValidityLabel } from './ValidityLabel'

interface PersonNameSectionProps {
    showValidation: boolean
}

export function PersonNameSection(props: PersonNameSectionProps) {
    const { showValidation } = props

    const [childValidChange, fieldValidity] = useFieldValidity()

    const vProps = {
        showValidation,
        onValidChange: childValidChange
    }

    return (
        <div className="address-input-section">
            <div className="form-group checkbox-form-group">
                <label>Not required</label> <ValidityLabel valid={fieldValidity.input0} />
                <PersonNameInput
                    name="input0"
                    individualInputsRequired={false}
                    validators={[]}
                    {...vProps}
                />
            </div>
            <div className="form-group checkbox-form-group">
                <label>Required, show middle name input</label>{' '}
                <ValidityLabel valid={fieldValidity.input1} />
                <PersonNameInput
                    name="input1"
                    individualInputsRequired={false}
                    showMiddleNameInput
                    validators={[]}
                    {...vProps}
                />
            </div>
        </div>
    )
}
