import { ReactElement, useState } from 'react'
import {
    TimeZoneValidators,
    TimeZoneInput,
    TimeZoneInputValue,
    useFieldValidity,
} from '@interface-technologies/iti-react'
import { TestFormGroup } from './TestFormGroup'

interface TimeZoneInputSectionProps {
    showValidation: boolean
}

export function TimeZoneInputSection({
    showValidation,
}: TimeZoneInputSectionProps): ReactElement {
    const [value0, setValue0] = useState<TimeZoneInputValue>(null)

    const { onChildValidChange, fieldValidity } = useFieldValidity()
    const vProps = {
        showValidation,
        onValidChange: onChildValidChange,
    }

    return (
        <div className="form-limit-width">
            <TestFormGroup
                label={<>Not required &amp; controlled</>}
                valid={fieldValidity.timeZoneInput0}
            >
                {(id) => (
                    <>
                        <TimeZoneInput
                            id={id}
                            name="timeZoneInput0"
                            value={value0}
                            onChange={setValue0}
                            placeholder="Select time zone..."
                            isClearable
                            validators={[]}
                            {...vProps}
                        />
                        <p className="mt-2">Value: {value0}</p>
                    </>
                )}
            </TestFormGroup>
            <TestFormGroup
                label={<>Required &amp; in flexbox</>}
                valid={fieldValidity.timeZoneInput1}
            >
                {' '}
                {(id) => (
                    <div className="d-flex">
                        <TimeZoneInput
                            id={id}
                            name="timeZoneInput1"
                            validators={[TimeZoneValidators.required()]}
                            width={400}
                            {...vProps}
                        />
                    </div>
                )}
            </TestFormGroup>
            <TestFormGroup label="Disabled" valid={fieldValidity.timeZoneInput2}>
                {(id) => (
                    <TimeZoneInput
                        id={id}
                        name="timeZoneInput2"
                        validators={[]}
                        enabled={false}
                        {...vProps}
                    />
                )}
            </TestFormGroup>
        </div>
    )
}
