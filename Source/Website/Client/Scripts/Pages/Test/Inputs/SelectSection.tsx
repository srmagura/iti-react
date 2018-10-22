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

interface SelectSectionProps extends React.Props<any> {
    showValidation: boolean
}

interface SelectSectionState {
    selectValue: SelectValue
    selectValue2: SelectValue
    selectValue3: MultiSelectValue
    selectValue4: MultiSelectValue
    fieldValidity: FieldValidity
}

export class SelectSection extends React.Component<
    SelectSectionProps,
    SelectSectionState
> {
    state: SelectSectionState = {
        fieldValidity: {},
        selectValue: null,
        selectValue2: null,
        selectValue3: [],
        selectValue4: []
    }

    static colorOptions = [
        { value: 'ocean', label: 'Ocean', color: '#00B8D9' },
        { value: 'blue', label: 'Blue', color: '#0052CC', disabled: true },
        { value: 'purple', label: 'Purple', color: '#5243AA' },
        { value: 'red', label: 'Red', color: '#FF5630' },
        { value: 'orange', label: 'Orange', color: '#FF8B00' },
        { value: 'yellow', label: 'Yellow', color: '#FFC400' },
        { value: 'green', label: 'Green', color: '#36B37E' },
        { value: 'forest', label: 'Forest', color: '#00875A' },
        { value: 'slate', label: 'Slate', color: '#253858' },
        { value: 'silver', label: 'Silver', color: '#666666' }
    ]

    static flavorOptions = [
        { value: 'vanilla', label: 'Vanilla' },
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'salted-caramel', label: 'Salted Caramel' }
    ]

    static groupedOptions = [
        {
            label: 'Colours',
            options: SelectSection.colorOptions
        },
        {
            label: 'Flavours',
            options: SelectSection.flavorOptions
        }
    ]

    childValidChange = (fieldName: string, valid: boolean) => {
        childValidChange(fieldName, valid, x => this.setState(...x))
    }

    render() {
        const { showValidation } = this.props
        const {
            fieldValidity,
            selectValue,
            selectValue2,
            selectValue3,
            selectValue4
        } = this.state

        return (
            <div className="select-section">
                <div className="form-group">
                    <label>Not required & show validation = false</label>{' '}
                    <ValidityLabel valid={fieldValidity.select0} />
                    <div className="d-flex" style={{ width: 600 }}>
                        {/* Don't set className because we want to test setting width via the prop. */}
                        <ValidatedSelect
                            name="select0"
                            options={SelectSection.colorOptions}
                            width={200}
                            showValidation={false}
                            validators={[]}
                            onValidChange={this.childValidChange}
                            isClearable
                        />
                        <select className="ml-2 form-control">
                            <option>Border color / width test</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label>Required and controlled</label>{' '}
                    <ValidityLabel valid={fieldValidity.select1} />
                    <ValidatedSelect
                        name="select1"
                        className="react-select"
                        options={SelectSection.colorOptions}
                        value={selectValue}
                        onChange={selectValue => this.setState({ selectValue })}
                        showValidation={showValidation}
                        validators={[SelectValidators.required()]}
                        onValidChange={this.childValidChange}
                    />
                </div>
                <div className="form-group">
                    <label>Controlled with grouped options</label>{' '}
                    <ValidityLabel valid={fieldValidity.select2} />
                    <ValidatedSelect
                        name="select2"
                        className="react-select"
                        options={SelectSection.groupedOptions}
                        value={selectValue2}
                        onChange={selectValue2 => this.setState({ selectValue2 })}
                        showValidation={showValidation}
                        validators={[SelectValidators.required()]}
                        onValidChange={this.childValidChange}
                        isClearable
                    />
                </div>
                <div className="form-group">
                    <label>Disabled</label>{' '}
                    <ValidityLabel valid={fieldValidity.select3} />
                    {/* Don't set className because we want to test setting width via the prop. */}
                    <div className="d-flex">
                        <div className="mr-3">
                            {' '}
                            <ValidatedSelect
                                name="select3"
                                options={SelectSection.colorOptions}
                                width={200}
                                showValidation={false}
                                validators={[]}
                                onValidChange={this.childValidChange}
                                isClearable
                                enabled={false}
                            />
                        </div>
                        <ValidatedInput
                            name="disabledTest"
                            inputAttributes={{
                                disabled: true,
                                placeholder: 'For comparison'
                            }}
                            validators={[]}
                            showValidation={false}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>Multi select</label>{' '}
                    <ValidityLabel valid={fieldValidity.mselect0} />
                    <div className="d-flex" style={{ width: 600 }}>
                        <ValidatedMultiSelect
                            name="mselect0"
                            width={350}
                            options={SelectSection.groupedOptions}
                            value={selectValue3}
                            onChange={selectValue3 => this.setState({ selectValue3 })}
                            showValidation={showValidation}
                            validators={[]}
                            onValidChange={this.childValidChange}
                            isClearable
                        />
                        <select className="ml-2 form-control">
                            <option>Width test</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label>Required multi select</label>{' '}
                    <ValidityLabel valid={fieldValidity.mselect1} />
                    <ValidatedMultiSelect
                        name="mselect1"
                        className="react-select"
                        options={SelectSection.groupedOptions}
                        value={selectValue4}
                        onChange={selectValue4 => this.setState({ selectValue4 })}
                        showValidation={showValidation}
                        validators={[MultiSelectValidators.required()]}
                        onValidChange={this.childValidChange}
                        isClearable
                    />
                </div>
                <div className="form-group">
                    <label>Test 0 as a value</label>{' '}
                    <ValidityLabel valid={fieldValidity.mselect2} />
                    <ValidatedSelect
                        name="mselect2"
                        className="react-select"
                        options={[
                            { value: 0, label: '0' },
                            { value: 1, label: '1' },
                            { value: 2, label: '2' }
                        ]}
                        showValidation={showValidation}
                        validators={[]}
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
                        options={SelectSection.groupedOptions}
                        showValidation={showValidation}
                        validators={[]}
                        onValidChange={this.childValidChange}
                        isClearable
                        enabled={false}
                    />
                </div>
            </div>
        )
    }
}
