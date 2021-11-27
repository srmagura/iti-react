import { useState, ReactElement } from 'react'
import {
    MultiSelectValue,
    MultiSelectValidators,
    ValidatedMultiSelect,
    useFieldValidity,
} from '@interface-technologies/iti-react'
import { groupedOptionsWithoutFixed, colorOptions } from './SelectOptions'
import { CustomOption } from './CustomOption'
import { TestFormGroup } from './TestFormGroup'

interface MultiSelectSectionProps {
    showValidation: boolean
}

export function MultiSelectSection({
    showValidation,
}: MultiSelectSectionProps): ReactElement {
    const { onChildValidChange, fieldValidity } = useFieldValidity()
    const vProps = { showValidation, onValidChange: onChildValidChange }

    const [selectValue0, setSelectValue0] = useState<MultiSelectValue>([])
    const [selectValue2, setSelectValue2] = useState<MultiSelectValue>([])

    return (
        <div className="multi-select-section">
            <p>Selected values should be listed in the order they were added.</p>
            <TestFormGroup label="Multi select" valid={fieldValidity.mselect0}>
                {(id) => (
                    <div className="d-flex" style={{ width: 600 }}>
                        <ValidatedMultiSelect
                            id={id}
                            name="mselect0"
                            width={350}
                            options={groupedOptionsWithoutFixed}
                            value={selectValue0}
                            onChange={setSelectValue0}
                            validators={[]}
                            isClearable
                            {...vProps}
                        />
                        <select className="ms-2 form-control">
                            <option>Width test</option>
                        </select>
                    </div>
                )}
            </TestFormGroup>
            <TestFormGroup label="Required multi select" valid={fieldValidity.mselect1}>
                {(id) => (
                    <ValidatedMultiSelect
                        id={id}
                        name="mselect1"
                        width={500}
                        className="react-select"
                        options={groupedOptionsWithoutFixed}
                        value={selectValue2}
                        onChange={setSelectValue2}
                        validators={[MultiSelectValidators.required()]}
                        isClearable
                        {...vProps}
                    />
                )}
            </TestFormGroup>
            <TestFormGroup label="Disabled" valid={fieldValidity.mselect3}>
                {(id) => (
                    <ValidatedMultiSelect
                        id={id}
                        name="mselect3"
                        width={500}
                        options={groupedOptionsWithoutFixed}
                        validators={[]}
                        isClearable
                        enabled={false}
                        {...vProps}
                    />
                )}
            </TestFormGroup>
            <TestFormGroup
                label="Custom option component + isLoading=true"
                valid={fieldValidity.mselect4}
            >
                {(id) => (
                    <ValidatedMultiSelect
                        id={id}
                        name="mselect4"
                        className="react-select"
                        width={500}
                        options={colorOptions.filter((o) => !o.isFixed)}
                        components={{ Option: CustomOption }}
                        validators={[]}
                        isClearable
                        isLoading
                        {...vProps}
                    />
                )}
            </TestFormGroup>
            <TestFormGroup
                label="isOptionEnabled - ONLY ocean value is disabled"
                valid={fieldValidity.mselect5}
            >
                {(id) => (
                    <ValidatedMultiSelect
                        id={id}
                        name="mselect5"
                        className="react-select"
                        width={500}
                        options={colorOptions.filter((o) => !o.isFixed)}
                        validators={[]}
                        isClearable
                        isOptionEnabled={(option) => option.value !== 'ocean'}
                        {...vProps}
                    />
                )}
            </TestFormGroup>
            <TestFormGroup label="Fixed options" valid={fieldValidity.mselect5}>
                {(id) => (
                    <ValidatedMultiSelect
                        id={id}
                        name="mselect6"
                        className="react-select"
                        width={500}
                        options={colorOptions}
                        validators={[]}
                        isClearable
                        defaultValue={['purple', 'red']}
                        {...vProps}
                    />
                )}
            </TestFormGroup>
        </div>
    )
}
