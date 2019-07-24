import * as React from 'react'
import {
    useFieldValidity,
    PersonNameInput,
    PersonNameValidators
} from '@interface-technologies/iti-react'
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
                    individualInputsRequired
                    showMiddleNameInput
                    validators={[PersonNameValidators.required()]}
                    {...vProps}
                />
            </div>
            <div className="form-group checkbox-form-group">
                <label>Fluid and first/last read only</label>{' '}
                <ValidityLabel valid={fieldValidity.input2} />
                <div style={{ width: 700 }}>
                    <PersonNameInput
                        name="input2"
                        individualInputsRequired={false}
                        showMiddleNameInput
                        fluid
                        validators={[]}
                        {...vProps}
                    />
                </div>
            </div>
        </div>
    )
}
