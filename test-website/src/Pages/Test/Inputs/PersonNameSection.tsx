import React from 'react'
import {
    useFieldValidity,
    PersonNameInput,
    PersonNameValidators,
} from '@interface-technologies/iti-react'
import { ValidityLabel } from './ValidityLabel'

interface PersonNameSectionProps {
    showValidation: boolean
}

export function PersonNameSection({ showValidation }: PersonNameSectionProps) {
    const { onChildValidChange, fieldValidity } = useFieldValidity()

    const vProps = {
        showValidation,
        onValidChange: onChildValidChange,
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
                <label>Fluid, first/last disabled, middle name green background</label>{' '}
                <ValidityLabel valid={fieldValidity.input2} />
                <div style={{ width: 700 }}>
                    <PersonNameInput
                        name="input2"
                        individualInputsRequired={false}
                        showMiddleNameInput
                        fluid
                        inputAttributesMap={{
                            middle: {
                                style: { backgroundColor: '#d9f2d9' },
                            },
                        }}
                        enabledInputs={['middle']}
                        validators={[]}
                        {...vProps}
                    />
                </div>
            </div>
        </div>
    )
}
