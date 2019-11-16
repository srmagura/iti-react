import React from 'react'
import {
    FieldValidity,
    childValidChange,
    ValidatedSelect,
    SelectValue,
    SelectValidators,
    MultiSelectValue,
    MultiSelectValidators,
    ValidatedMultiSelect,
    ValidatedInput
} from '@interface-technologies/iti-react'
import { ValidityLabel } from './ValidityLabel'
import { groupedOptions, colorOptions } from './SelectOptions'
import { FormGroup } from 'Components/FormGroup'
import { CustomOption } from './CustomOption'
import { sortBy } from 'lodash'

interface MutliSelectSectionProps {
    showValidation: boolean
}

interface MutliSelectSectionState {
    selectValue0: MultiSelectValue
    selectValue2: MultiSelectValue
    fieldValidity: FieldValidity
}

export class MultiSelectSection extends React.Component<
    MutliSelectSectionProps,
    MutliSelectSectionState
> {
    state: MutliSelectSectionState = {
        fieldValidity: {},
        selectValue0: [],
        selectValue2: []
    }

    childValidChange = (fieldName: string, valid: boolean) => {
        childValidChange(fieldName, valid, x => this.setState(...x))
    }

    render() {
        const { showValidation } = this.props
        const { fieldValidity, selectValue0, selectValue2 } = this.state

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
                                onChange={selectValue0 => this.setState({ selectValue0 })}
                                showValidation={showValidation}
                                validators={[]}
                                onValidChange={this.childValidChange}
                                isClearable
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
                        onChange={selectValue2 => this.setState({ selectValue2 })}
                        showValidation={showValidation}
                        validators={[MultiSelectValidators.required()]}
                        onValidChange={this.childValidChange}
                        isClearable
                    />
                </div>
                <div className="form-group">
                    <label>Disabled</label>{' '}
                    <ValidityLabel valid={fieldValidity.mselect3} />
                    <ValidatedMultiSelect
                        name="mselect3"
                        width={500}
                        options={groupedOptions}
                        showValidation={showValidation}
                        validators={[]}
                        onValidChange={this.childValidChange}
                        isClearable
                        enabled={false}
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
                        showValidation={showValidation}
                        validators={[]}
                        onValidChange={this.childValidChange}
                        isClearable
                        isLoading
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
                        showValidation={showValidation}
                        validators={[]}
                        onValidChange={this.childValidChange}
                        isClearable
                        isOptionEnabled={option => option.value !== 'ocean'}
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
                        showValidation={showValidation}
                        validators={[]}
                        onValidChange={this.childValidChange}
                        isClearable
                        defaultValue={['purple', 'red']}
                    />
                </div>
            </div>
        )
    }
}
