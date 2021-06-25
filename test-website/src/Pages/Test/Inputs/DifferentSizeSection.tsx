import React from 'react'
import {
    ValidatedInput,
    DateInput,
    ValidatedSelect,
    ValidatedMultiSelect,
    defaultDateInputValue,
} from '@interface-technologies/iti-react'
import { colorOptions } from './SelectOptions'

interface DifferentSizeSectionProps {
    showValidation: boolean
}

export class DifferentSizeSection extends React.Component<DifferentSizeSectionProps> {
    render() {
        return (
            <div className="row">
                <div className="col-5">
                    {this.renderCol('Small', 'form-control-sm', 'sm')}
                </div>
                <div className="col-1" />
                <div className="col-6">
                    {this.renderCol('Large', 'form-control-lg', 'lg')}
                </div>
            </div>
        )
    }

    renderCol(label: string, className: string, formControlSize: 'sm' | 'lg') {
        const { showValidation } = this.props

        const vProps = { showValidation, validators: [] }

        return (
            <div>
                <h4 className="mb-4">{label}</h4>
                <div className="form-group">
                    <label>ValidatedInput</label>
                    <ValidatedInput
                        name="validatedInput"
                        className={className}
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label>DateInput</label>
                    <DateInput
                        name="dateInput"
                        value={defaultDateInputValue}
                        onChange={() => { }}
                        className={className}
                        timeZone="local"
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label>DateInput (no picker)</label>
                    <DateInput
                        name="dateInputNoPicker"
                        className={className}
                        timeZone="local"
                        value={defaultDateInputValue}
                        onChange={() => { }}
                        showPicker={false}
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label>ValidatedSelect</label>
                    <ValidatedSelect
                        name="validatedSelect"
                        formControlSize={formControlSize}
                        options={colorOptions}
                        defaultValue={colorOptions[0].value}
                        isClearable
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label>ValidatedMultiSelect</label>
                    <ValidatedMultiSelect
                        name="validatedMultiSelect"
                        formControlSize={formControlSize}
                        options={colorOptions.filter((o) => !o.isFixed)}
                        {...vProps}
                    />
                </div>
            </div>
        )
    }
}
