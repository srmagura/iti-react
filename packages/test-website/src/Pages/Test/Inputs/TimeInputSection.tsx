import { useState } from 'react'
import {
    TimeInput,
    TimeValidators,
    TimeInputValue,
    timeInputValueToDecimalHours,
    useFieldValidity,
} from '@interface-technologies/iti-react'
import { ValidityLabel } from './ValidityLabel'

interface TimeInputSectionProps {
    showValidation: boolean
}

export function TimeInputSection({ showValidation }: TimeInputSectionProps) {
    const { onChildValidChange, fieldValidity } = useFieldValidity()
    const vProps = { showValidation, onValidChange: onChildValidChange }

    const [value2, setValue2] = useState<TimeInputValue>({
        hours: 12,
        minutes: 15,
        ampm: 'pm',
    })

    return (
        <div>
            <div className="form-group">
                <label>Not required</label>{' '}
                <ValidityLabel valid={fieldValidity.timeInput0} />
                <TimeInput
                    individualInputsRequired={false}
                    name="timeInput0"
                    validators={[]}
                    {...vProps}
                />
            </div>
            <div className="form-group">
                <label>Required</label> <ValidityLabel valid={fieldValidity.timeInput1} />
                <TimeInput
                    name="timeInput1"
                    individualInputsRequired={true}
                    validators={[TimeValidators.required()]}
                    {...vProps}
                />
            </div>
            <div className="form-group">
                <label>Controlled</label>{' '}
                <ValidityLabel valid={fieldValidity.timeInput2} />
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
            </div>
            <div className="form-group">
                <label>Disabled</label> <ValidityLabel valid={fieldValidity.timeInput2} />
                <TimeInput
                    individualInputsRequired={false}
                    isClearable={true}
                    name="timeInput3"
                    validators={[]}
                    value={{ hours: 5, minutes: 15, ampm: 'pm' }}
                    onChange={() => {}}
                    enabled={false}
                    {...vProps}
                />
            </div>
        </div>
    )
}
