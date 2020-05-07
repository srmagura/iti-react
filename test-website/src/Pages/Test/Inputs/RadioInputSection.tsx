import React, { useState } from 'react'
import { range } from 'lodash'
import {
    FieldValidity,
    RadioInput,
    RadioValidators,
    RadioOption,
    BooleanRadioInput,
    BooleanRadioValidators,
    useFieldValidity,
} from '@interface-technologies/iti-react'
import { ValidityLabel } from './ValidityLabel'

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

export function RadioInputSection(props: RadioInputSectionProps) {
    const { showValidation } = props
    const [value1, setValue1] = useState<Color | null>(null)

    const [onChildValidChange, fieldValidity] = useFieldValidity()
    const vProps = {
        showValidation,
        onValidChange: onChildValidChange,
    }

    return (
        <div>
            <div className="form-group">
                <label>Not required</label>{' '}
                <ValidityLabel valid={fieldValidity.radioInput0} />
                <RadioInput
                    name="radioInput0"
                    defaultValue={null}
                    options={options}
                    validators={[]}
                    {...vProps}
                />
            </div>
            <div className="form-group">
                <label>Required & controlled</label>{' '}
                <ValidityLabel valid={fieldValidity.radioInput1} />
                <RadioInput
                    name="radioInput1"
                    value={value1}
                    onChange={(v) => setValue1(v as Color)}
                    options={options}
                    validators={[RadioValidators.required()]}
                    {...vProps}
                />
            </div>
            <div className="form-group">
                <label>Boolean & required</label>{' '}
                <ValidityLabel valid={fieldValidity.radioInput2} />
                <BooleanRadioInput
                    name="radioInput2"
                    defaultValue={null}
                    validators={[BooleanRadioValidators.required()]}
                    {...vProps}
                />
            </div>
            <div className="form-group">
                <label>Boolean & required (trueFirst = false)</label>{' '}
                <ValidityLabel valid={fieldValidity.radioInputFalseFirst} />
                <BooleanRadioInput
                    name="radioInputFalseFirst"
                    trueFirst={false}
                    defaultValue={null}
                    validators={[BooleanRadioValidators.required()]}
                    {...vProps}
                />
            </div>
            <div className="form-group">
                <label>Boolean with different labels and with styling</label>{' '}
                <ValidityLabel valid={fieldValidity.radioInput3} />
                <div className="styled-radio-input">
                    <BooleanRadioInput
                        name="radioInput3"
                        defaultValue={null}
                        labels={{ true: 'Enabled', false: 'Disabled' }}
                        validators={[]}
                        {...vProps}
                    />
                </div>
            </div>
            <div className="form-group">
                <label>Test of display: grid</label>{' '}
                <ValidityLabel valid={fieldValidity.gridRadioInput} />
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
            </div>
            <div className="form-group">
                <label>Stacked with label elements</label>{' '}
                <ValidityLabel valid={fieldValidity.radioInput4} />
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
            </div>
        </div>
    )
}
