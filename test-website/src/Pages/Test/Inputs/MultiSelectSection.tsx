import React, { useState } from 'react'
import {
    FieldValidity,
    MultiSelectValue,
    MultiSelectValidators,
    ValidatedMultiSelect,
    useFieldValidity
} from '@interface-technologies/iti-react'
import { ValidityLabel } from './ValidityLabel'
import { groupedOptions, colorOptions } from './SelectOptions'
import { FormGroup } from 'Components/FormGroup'
import { CustomOption } from './CustomOption'

interface MultiSelectSectionProps {
    showValidation: boolean
}

interface MutliSelectSectionState {
    selectValue0: MultiSelectValue
    selectValue2: MultiSelectValue
    fieldValidity: FieldValidity
}

export function MultiSelectSection (props:MultiSelectSectionProps) {
    const { showValidation } = props

    const [onChildValidChange, fieldValidity] = useFieldValidity()
    const vProps = {showValidation,onValidChange:onChildValidChange}

    const [selectValue0,setSelectValue0]=useState<MultiSelectValue>([])
    const [selectValue2, setSelectValue2] =useState<MultiSelectValue>([])

        return (
            <div className="multi-select-section">
                <p>Selected values should be listed in the order they were added.</p>
                <FormGroup
                    label={
                        <span>
                            Multi select <ValidityLabel valid={fieldValidity.mselect0} />
                        </span>
                    }
                >
                    {id => (
                        <div className="d-flex" style={{ width: 600 }}>
                            <ValidatedMultiSelect
                                id={id}
                                name="mselect0"
                                width={350}
                                options={groupedOptions}
                                value={selectValue0}
                                onChange={setSelectValue0}
                                validators={[]}
                                isClearable
                                {...vProps}
                            />
                            <select className="ml-2 form-control">
                                <option>Width test</option>
                            </select>
                        </div>
                    )}
                </FormGroup>
                <div className="form-group">
                    <label>Required multi select</label>{' '}
                    <ValidityLabel valid={fieldValidity.mselect1} />
                    <ValidatedMultiSelect
                        name="mselect1"
                        width={500}
                        className="react-select"
                        options={groupedOptions}
                        value={selectValue2}
                        onChange={setSelectValue2}
                        validators={[MultiSelectValidators.required()]}
                        isClearable
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label>Disabled</label>{' '}
                    <ValidityLabel valid={fieldValidity.mselect3} />
                    <ValidatedMultiSelect
                        name="mselect3"
                        width={500}
                        options={groupedOptions}
                        validators={[]}
                        isClearable
                        enabled={false}
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label>Custom option component + isLoading=true</label>{' '}
                    <ValidityLabel valid={fieldValidity.mselect4} />
                    <ValidatedMultiSelect
                        name="mselect4"
                        className="react-select"
                        width={500}
                        options={colorOptions}
                        components={{ Option: CustomOption }}
                        validators={[]}
                        isClearable
                        isLoading
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label>isOptionEnabled - ocean value disabled</label>{' '}
                    <ValidityLabel valid={fieldValidity.mselect5} />
                    <ValidatedMultiSelect
                        name="mselect5"
                        className="react-select"
                        width={500}
                        options={colorOptions}
                        validators={[]}
                        isClearable
                        isOptionEnabled={option => option.value !== 'ocean'}
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label>Fixed options</label>{' '}
                    <ValidityLabel valid={fieldValidity.mselect5} />
                    <ValidatedMultiSelect
                        name="mselect6"
                        className="react-select"
                        width={500}
                        options={colorOptions}
                        validators={[]}
                        isClearable
                        defaultValue={['purple', 'red']}
                        {...vProps}
                    />
                </div>
            </div>
        )
}
