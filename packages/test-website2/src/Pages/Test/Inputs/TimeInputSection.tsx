import { ReactElement, useState } from 'react'
import {
    TimeInput,
    TimeValidators,
    TimeInputValue,
    timeInputValueToDecimalHours,
    useFieldValidity,
} from '@interface-technologies/iti-react'
import { TestFormGroup } from './TestFormGroup'

interface TimeInputSectionProps {
    showValidation: boolean
}

export function TimeInputSection({
    showValidation,
}: TimeInputSectionProps): ReactElement {
    const { onChildValidChange, fieldValidity } = useFieldValidity()
    const vProps = { showValidation, onValidChange: onChildValidChange }

    const [value2, setValue2] = useState<TimeInputValue>({
        hours: 12,
        minutes: 15,
        ampm: 'pm',
    })

    return (
        <div>
            <TestFormGroup label="Not required" valid={fieldValidity.timeInput0}>
                <TimeInput
                    individualInputsRequired={false}
                    name="timeInput0"
                    validators={[]}
                    {...vProps}
                />
            </TestFormGroup>
            <TestFormGroup label="Required" valid={fieldValidity.timeInput1}>
                <TimeInput
                    name="timeInput1"
                    individualInputsRequired
                    validators={[TimeValidators.required()]}
                    {...vProps}
                />
            </TestFormGroup>
            <TestFormGroup label="Controlled" valid={fieldValidity.timeInput2}>
                <div className="d-flex align-items-baseline">
                    <TimeInput
                        individualInputsRequired={false}
                        isClearable={false}
                        name="timeInput2"
                        validators={[]}
                        value={value2}
                        onChange={setValue2}
                        {...vProps}
                    />
                    <div className="ms-4">
                        Decimal hours = {timeInputValueToDecimalHours(value2)}
                    </div>
                </div>
            </TestFormGroup>
            <TestFormGroup label="Disabled" valid={fieldValidity.timeInput2}>
                <TimeInput
                    individualInputsRequired={false}
                    isClearable
                    name="timeInput3"
                    validators={[]}
                    value={{ hours: 5, minutes: 15, ampm: 'pm' }}
                    onChange={() => {}}
                    enabled={false}
                    {...vProps}
                />
            </TestFormGroup>
        </div>
    )
}
