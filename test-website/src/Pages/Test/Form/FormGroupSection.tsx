import { FormCheck, FormGroup, ValidatedInput } from '@interface-technologies/iti-react'
import React from 'react'


export function FormGroupSection(): React.ReactElement {
    return <div className="card">
        <div className="card-body">
            <h5 className="card-title">
                Form Group Alignment Tests
            </h5>
            <div className="d-flex">
            <FormGroup label="Field">
                {id => <ValidatedInput
                        id={id}
                        defaultValue="test value"
                        name="alignment1"
                        validators={[]}
                        showValidation={false}
                        inputAttributes={{ style: {width: 80}}}
                />}
                </FormGroup>
                <FormGroup label={<span>&nbsp;</span>} className="form-group-horizontal-with-checkbox">
                    Text
                    </FormGroup>
                <FormGroup label={<span>&nbsp;</span>} className="form-group-horizontal-with-checkbox">
                    <FormCheck label="Checkbox" />
                    </FormGroup>

            </div>
            <div className="d-flex font-size-sm" >
                <FormGroup label="Field">
                    {id => <ValidatedInput
                        id={id}
                        defaultValue="test value"
                        name="alignment1"
                        validators={[]}
                        showValidation={false}
                        inputAttributes={{ style: { width: 80 } }}
                        className="form-control-sm"
                    />}
                </FormGroup>
                <FormGroup label={<span>&nbsp;</span>} className="form-group-horizontal-with-checkbox-sm">
                    Text
                    </FormGroup>
                <FormGroup label={<span>&nbsp;</span>} className="form-group-horizontal-with-checkbox-sm">
                    <FormCheck label="Checkbox" />
                </FormGroup>

            </div>

        </div>
    </div>
}