import { ReactElement } from 'react'
import {
    ValidatedInput,
    DateInput,
    ValidatedSelect,
    ValidatedMultiSelect,
    DateInputNoPicker,
    FormGroup,
} from '@interface-technologies/iti-react'
import { colorOptions } from './SelectOptions'

interface DifferentSizeSectionProps {
    showValidation: boolean
}

export function DifferentSizeSection({
    showValidation,
}: DifferentSizeSectionProps): ReactElement {
    function renderCol(
        label: string,
        className: string,
        formControlSize: 'sm' | 'lg'
    ): ReactElement {
        const vProps = { showValidation, validators: [] }

        return (
            <div>
                <h4 className="mb-4">{label}</h4>
                <FormGroup label="ValidatedInput">
                    {(id) => (
                        <ValidatedInput
                            id={id}
                            name="validatedInput"
                            className={className}
                            {...vProps}
                        />
                    )}
                </FormGroup>
                <FormGroup label="DateInput">
                    {(id) => (
                        <DateInput
                            id={id}
                            name="dateInput"
                            value={null}
                            onChange={() => {}}
                            className={className}
                            timeZone="local"
                            {...vProps}
                        />
                    )}
                </FormGroup>
                <FormGroup label="DateInputNoPicker">
                    {(id) => (
                        <DateInputNoPicker
                            id={id}
                            name="dateInputNoPicker"
                            className={className}
                            value=""
                            onChange={() => {}}
                            {...vProps}
                        />
                    )}
                </FormGroup>
                <FormGroup label="ValidatedSelect">
                    {(id) => (
                        <ValidatedSelect
                            id={id}
                            name="validatedSelect"
                            formControlSize={formControlSize}
                            options={colorOptions}
                            defaultValue={colorOptions[0].value}
                            isClearable
                            {...vProps}
                        />
                    )}
                </FormGroup>
                <FormGroup label="ValidatedMultiSelect">
                    {(id) => (
                        <ValidatedMultiSelect
                            id={id}
                            name="validatedMultiSelect"
                            formControlSize={formControlSize}
                            options={colorOptions.filter((o) => !o.isFixed)}
                            {...vProps}
                        />
                    )}
                </FormGroup>
            </div>
        )
    }

    return (
        <div className="row">
            <div className="col-5">{renderCol('Small', 'form-control-sm', 'sm')}</div>
            <div className="col-1" />
            <div className="col-6">{renderCol('Large', 'form-control-lg', 'lg')}</div>
        </div>
    )
}
