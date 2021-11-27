import { ReactElement, useState } from 'react'
import { range } from 'lodash'
import {
    RadioInput,
    RadioValidators,
    RadioOption,
    BooleanRadioInput,
    BooleanRadioValidators,
    useFieldValidity,
} from '@interface-technologies/iti-react'
import { TestFormGroup } from './TestFormGroup'

enum Color {
    Red,
    Blue,
    Green,
    Yellow,
}

const options: RadioOption[] = [
    { value: Color.Red, label: 'Red' },
    { value: Color.Blue, label: 'Blue' },
    { value: Color.Green, label: 'Green' },
    { value: Color.Yellow, label: 'Yellow' },
]

interface RadioInputSectionProps {
    showValidation: boolean
}

export function RadioInputSection({
    showValidation,
}: RadioInputSectionProps): ReactElement {
    const [value1, setValue1] = useState<Color | null>(null)

    const { onChildValidChange, fieldValidity } = useFieldValidity()
    const vProps = {
        showValidation,
        onValidChange: onChildValidChange,
    }

    return (
        <div>
            <TestFormGroup label="Not required" valid={fieldValidity.radioInput0}>
                <RadioInput
                    name="radioInput0"
                    defaultValue={null}
                    options={options}
                    validators={[]}
                    {...vProps}
                />
            </TestFormGroup>
            <TestFormGroup
                label={<>Required &amp; controlled</>}
                valid={fieldValidity.radioInput1}
            >
                <RadioInput
                    name="radioInput1"
                    value={value1}
                    onChange={(v) => setValue1(v as Color)}
                    options={options}
                    validators={[RadioValidators.required()]}
                    {...vProps}
                />
            </TestFormGroup>
            <TestFormGroup
                label={<>Boolean &amp; required</>}
                valid={fieldValidity.radioInput2}
            >
                <BooleanRadioInput
                    name="radioInput2"
                    defaultValue={null}
                    validators={[BooleanRadioValidators.required()]}
                    {...vProps}
                />
            </TestFormGroup>
            <TestFormGroup
                label={<>Boolean &amp; required (trueFirst = false)</>}
                valid={fieldValidity.radioInputFalseFirst}
            >
                <BooleanRadioInput
                    name="radioInputFalseFirst"
                    trueFirst={false}
                    defaultValue={null}
                    validators={[BooleanRadioValidators.required()]}
                    {...vProps}
                />
            </TestFormGroup>
            <TestFormGroup
                label="Boolean with different labels and with styling"
                valid={fieldValidity.radioInput3}
            >
                <div className="styled-radio-input">
                    <BooleanRadioInput
                        name="radioInput3"
                        defaultValue={null}
                        labels={{ true: 'Enabled', false: 'Disabled' }}
                        validators={[]}
                        {...vProps}
                    />
                </div>
            </TestFormGroup>
            <TestFormGroup
                label="Test of display: grid"
                valid={fieldValidity.gridRadioInput}
            >
                <RadioInput
                    name="gridRadioInput"
                    defaultValue={null}
                    options={range(20).map((i) => ({
                        value: i,
                        label: i.toString(),
                    }))}
                    validators={[]}
                    {...vProps}
                />
            </TestFormGroup>
            <TestFormGroup
                label="Stacked with label elements"
                valid={fieldValidity.radioInput4}
            >
                <RadioInput
                    name="radioInput4"
                    defaultValue={null}
                    options={options.map((o) => ({
                        value: o.value,
                        label: (
                            <span style={{ color: o.label as string }}>{o.label}</span>
                        ),
                    }))}
                    buttonOptions={{ inline: false }}
                    validators={[]}
                    {...vProps}
                />
            </TestFormGroup>
        </div>
    )
}
