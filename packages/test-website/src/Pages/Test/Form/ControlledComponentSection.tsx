import { ReactElement, useState } from 'react'
import { FormGroup, ValidatedInput, Validators } from '@interface-technologies/iti-react'

interface ControlledComponentSectionProps {
    showValidation: boolean
}

export function ControlledComponentSection({
    showValidation,
}: ControlledComponentSectionProps): ReactElement {
    const [value0, setValue0] = useState(0)
    const [value1, setValue1] = useState('')
    const [value2, setValue2] = useState<string>()

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Controlled Component</h5>
                <div className="form-group">
                    <label>
                        ValidatedInput as a controlled component - should be impossible to
                        get field to display a non-integer value{' '}
                    </label>
                    <ValidatedInput
                        name="Controlled0"
                        value={value0.toString()}
                        onChange={(v) =>
                            setValue0(!Number.isNaN(parseInt(v)) ? parseInt(v) : 0)
                        }
                        showValidation={showValidation}
                        validators={[Validators.greaterThan(10)]}
                    />
                </div>
                <FormGroup label="Controlled component with max length 4">
                    {(id) => (
                        <ValidatedInput
                            id={id}
                            name="Controlled1"
                            value={value1}
                            onChange={setValue1}
                            showValidation={showValidation}
                            validators={[Validators.maxLength(4)]}
                        />
                    )}
                </FormGroup>
                <FormGroup label="Has value and onChange props, but value starts as undefined">
                    {(id) => (
                        <>
                            <ValidatedInput
                                id={id}
                                name="Controlled2"
                                value={value2}
                                onChange={setValue2}
                                showValidation={showValidation}
                                validators={[]}
                            />
                            <p className="mb-0">
                                <small>
                                    Input should be editable but give a &quot;switching
                                    from controlled to uncontrolled is not allowed&quot;
                                    warning when you type in it.
                                </small>
                            </p>
                            <p className="mb-0">
                                <small>Current input value: {value2}</small>
                            </p>
                        </>
                    )}
                </FormGroup>
            </div>
        </div>
    )
}
