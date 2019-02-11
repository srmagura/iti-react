import * as React from 'react'
import {
    FieldValidity,
    childValidChange,
    ValidatedSelect,
    SelectValue,
    SelectValidators,
    ValidatedInput,
    getSelectStyles
} from '@interface-technologies/iti-react'
import { ValidityLabel } from './ValidityLabel'
import { colorOptions, groupedOptions } from './SelectOptions'
import { CustomOption } from './CustomOption'
import { FormGroup } from 'Components/FormGroup'

interface SelectSectionProps {
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

    // So that ValidatedSelect, a PureComponent, won't unnecessarily update
    readonly noValidators = []
    readonly requiredValidators = [SelectValidators.required()]

    onChange = (selectValue: SelectValue) => this.setState({ selectValue })
    onChange2 = (selectValue2: SelectValue) => this.setState({ selectValue2 })

    render() {
        const { showValidation } = this.props
        const { fieldValidity, selectValue, selectValue2 } = this.state

        return (
            <div className="select-section">
                <FormGroup
                    label={
                        <span>
                            Not required & show validation = false{' '}
                            <ValidityLabel valid={fieldValidity.select0} />
                        </span>
                    }
                >
                    {id => (
                        <div className="d-flex" style={{ width: 600 }}>
                            {/* Don't set className because we want to test setting width via the prop. */}
                            <ValidatedSelect
                                id={id}
                                name="select0"
                                options={colorOptions}
                                width={200}
                                showValidation={false}
                                validators={this.noValidators}
                                onValidChange={this.childValidChange}
                                isClearable
                            />
                            <select className="ml-2 form-control">
                                <option>Border color / width test</option>
                            </select>
                        </div>
                    )}
                </FormGroup>
                <div className="form-group">
                    <label>Required and controlled</label>{' '}
                    <ValidityLabel valid={fieldValidity.select1} />
                    <ValidatedSelect
                        name="select1"
                        className="react-select"
                        options={colorOptions}
                        value={selectValue}
                        onChange={this.onChange}
                        showValidation={showValidation}
                        validators={this.requiredValidators}
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
                        onChange={this.onChange2}
                        showValidation={showValidation}
                        validators={this.requiredValidators}
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
                                validators={this.noValidators}
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
                <div className="form-group">
                    <label>Test 0 as a value</label>{' '}
                    <ValidityLabel valid={fieldValidity.select4} />
                    <ValidatedSelect
                        name="select4"
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
                <div
                    style={{
                        position: 'absolute',
                        backgroundColor: 'hsla(0,0%,0%, 0.5)',
                        color: 'white',
                        zIndex: 10,
                        padding: '0.5rem'
                    }}
                >
                    Make sure the select options display over top of this element
                    (z-index=10)
                </div>
                {/* Because previous element has absolute positioning */}
                <div style={{ height: '4rem' }} />
                <div className="form-group">
                    <label>Custom option component</label>{' '}
                    <ValidityLabel valid={fieldValidity.select5} />
                    <ValidatedSelect
                        name="select5"
                        className="react-select"
                        options={colorOptions}
                        components={{ Option: CustomOption }}
                        showValidation={showValidation}
                        validators={this.noValidators}
                        onValidChange={this.childValidChange}
                    />
                </div>
                <div className="form-group">
                    <label>Custom styles</label>{' '}
                    <ValidityLabel valid={fieldValidity.select6} />
                    <ValidatedSelect
                        name="select6"
                        className="react-select"
                        options={colorOptions}
                        getStyles={options => {
                            const defaultStyles = getSelectStyles(options)

                            return {
                                ...defaultStyles,
                                control: (base: any, state: any) => ({
                                    ...defaultStyles.control(base, state),
                                    backgroundColor: 'lemonchiffon'
                                })
                            }
                        }}
                        showValidation={showValidation}
                        validators={this.noValidators}
                        onValidChange={this.childValidChange}
                    />
                </div>
            </div>
        )
    }
}
