import * as React from 'react'
import {
    FieldValidity,
    childValidChange,
    ValidatedSelect,
    SelectValue,
    SelectValidators,
    ValidatedInput
} from '@interface-technologies/iti-react'
import { ValidityLabel } from './ValidityLabel'
import { colorOptions, groupedOptions } from './SelectOptions'

interface SelectSectionProps extends React.Props<any> {
    showValidation: boolean
}

interface SelectSectionState {
    selectValue: SelectValue
    selectValue2: SelectValue
    fieldValidity: FieldValidity
}

export class SelectSection extends React.Component<
    SelectSectionProps,
    SelectSectionState
> {
    state: SelectSectionState = {
        fieldValidity: {},
        selectValue: null,
        selectValue2: null
    }

    childValidChange = (fieldName: string, valid: boolean) => {
        childValidChange(fieldName, valid, x => this.setState(...x))
    }

    render() {
        const { showValidation } = this.props
        const { fieldValidity, selectValue, selectValue2 } = this.state

        return (
            <div className="select-section">
                <div className="form-group">
                    <label>Not required & show validation = false</label>{' '}
                    <ValidityLabel valid={fieldValidity.select0} />
                    <div className="d-flex" style={{ width: 600 }}>
                        {/* Don't set className because we want to test setting width via the prop. */}
                        <ValidatedSelect
                            name="select0"
                            options={colorOptions}
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
                        options={colorOptions}
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
                        options={groupedOptions}
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
                                options={colorOptions}
                                width={200}
                                showValidation={false}
                                validators={[]}
                                defaultValue={colorOptions[0].value}
                                onValidChange={this.childValidChange}
                                isClearable
                                enabled={false}
                            />
                        </div>
                        <ValidatedInput
                            name="disabledTest"
                            inputAttributes={{
                                disabled: true,
                                placeholder: 'Input for comparison'
                            }}
                            validators={[]}
                            showValidation={false}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
