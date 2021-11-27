import {
    useFieldValidity,
    PersonNameInput,
    PersonNameValidators,
} from '@interface-technologies/iti-react'
import { ReactElement } from 'react'
import { TestFormGroup } from './TestFormGroup'

interface PersonNameSectionProps {
    showValidation: boolean
}

export function PersonNameSection({
    showValidation,
}: PersonNameSectionProps): ReactElement {
    const { onChildValidChange, fieldValidity } = useFieldValidity()

    const vProps = {
        showValidation,
        onValidChange: onChildValidChange,
    }

    return (
        <div className="person-name-section">
            <TestFormGroup label="Not required" valid={fieldValidity.input0}>
                <PersonNameInput
                    name="input0"
                    individualInputsRequired={false}
                    validators={[]}
                    {...vProps}
                />
            </TestFormGroup>
            <TestFormGroup
                label="Required, show middle name input"
                valid={fieldValidity.input1}
            >
                <PersonNameInput
                    name="input1"
                    individualInputsRequired
                    showMiddleNameInput
                    validators={[PersonNameValidators.required()]}
                    {...vProps}
                />
            </TestFormGroup>
            <TestFormGroup
                label="Fluid, first/last disabled, middle name green background"
                valid={fieldValidity.input2}
            >
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
            </TestFormGroup>
        </div>
    )
}
