import { ReactElement } from 'react'
import {
    PhoneInput,
    Validators,
    useFieldValidity,
} from '@interface-technologies/iti-react'
import { TestFormGroup } from './TestFormGroup'

interface PhoneInputSectionProps {
    showValidation: boolean
}

export function PhoneInputSection({
    showValidation,
}: PhoneInputSectionProps): ReactElement {
    const { onChildValidChange, fieldValidity } = useFieldValidity()
    const vProps = {
        showValidation,
        onValidChange: onChildValidChange,
    }

    return (
        <div>
            <TestFormGroup label="Not required" valid={fieldValidity.phoneInput0}>
                {(id) => (
                    <PhoneInput
                        id={id}
                        name="phoneInput0"
                        defaultValue=""
                        validators={[]}
                        {...vProps}
                    />
                )}
            </TestFormGroup>
            <TestFormGroup label="Required" valid={fieldValidity.phoneInput1}>
                {(id) => (
                    <PhoneInput
                        id={id}
                        name="phoneInput1"
                        defaultValue=""
                        validators={[Validators.required()]}
                        {...vProps}
                    />
                )}
            </TestFormGroup>
            <TestFormGroup
                label="Invalid default value"
                valid={fieldValidity.phoneInput2}
            >
                {(id) => (
                    <PhoneInput
                        id={id}
                        name="phoneInput2"
                        defaultValue="(919)555-271"
                        validators={[]}
                        {...vProps}
                    />
                )}
            </TestFormGroup>
        </div>
    )
}
