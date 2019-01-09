import * as React from 'react'
import {
    ValidatedInput,
    DateInput,
    ValidatedSelect,
    ValidatedMultiSelect
} from '@interface-technologies/iti-react'
import { colorOptions } from './SelectOptions'

interface DifferentSizeSectionProps {
    showValidation: boolean
}

export class DifferentSizeSection extends React.Component<DifferentSizeSectionProps> {
    render() {
        const { showValidation } = this.props

        const vProps = { showValidation, validators: [] }

        return (
            <div>
                <div className="form-group">
                    <label>Small ValidatedInput</label>
                    <ValidatedInput
                        name="validatedInput"
                        className="form-control-sm"
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label>Small DateInput</label>
                    <DateInput name="dateInput" className="form-control-sm" {...vProps} />
                </div>
                <div className="form-group">
                    <label>Small ValidatedSelect</label>
                    <ValidatedSelect
                        name="validatedSelect"
                        className="form-control-sm"
                        options={colorOptions}
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label>Small ValidatedMultiSelect</label>
                    <ValidatedMultiSelect
                        name="validatedMultiSelect"
                        className="form-control-sm"
                        options={colorOptions}
                        {...vProps}
                    />
                </div>
            </div>
        )
    }
}
