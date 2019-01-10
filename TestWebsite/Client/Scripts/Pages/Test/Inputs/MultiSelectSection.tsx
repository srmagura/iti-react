import * as React from 'react'
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
import { groupedOptions } from './SelectOptions'
import { FormGroup } from 'Components/FormGroup'
import { CustomOption } from './CustomOption'

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
                    <label>Multi select</label>{' '}
                    <ValidityLabel valid={fieldValidity.mselect3} />
                    <ValidatedMultiSelect
                        name="mselect3"
                        width={350}
                        options={groupedOptions}
                        showValidation={showValidation}
                        validators={[]}
                        onValidChange={this.childValidChange}
                        isClearable
                        enabled={false}
                    />
                </div>
                <div className="form-group">
                    <label>Custom option component</label>{' '}
                    <ValidityLabel valid={fieldValidity.mselect4} />
                    <ValidatedMultiSelect
                        name="mselect4"
                        className="react-select"
                        options={groupedOptions}
                        components={{ Option: CustomOption }}
                        showValidation={showValidation}
                        validators={[]}
                        onValidChange={this.childValidChange}
                        isClearable
                    />
                </div>
            </div>
        )
    }
}
