import React from 'react'
import { ValidatedInput, Validators } from '@interface-technologies/iti-react'

interface ControlledComponentSectionProps {
    showValidation: boolean
}

interface ControlledComponentSectionState {
    value0: number
    value1: string
    value2?: string
}

export class ControlledComponentSection extends React.Component<
    ControlledComponentSectionProps,
    ControlledComponentSectionState
> {
    state: ControlledComponentSectionState = {
        value0: 0,
        value1: '',
    }

    render() {
        const { showValidation } = this.props
        const { value0, value1, value2 } = this.state

        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Controlled Component</h5>
                    <div className="form-group">
                        <label>
                            ValidatedInput as a controlled component - should be
                            impossible to get field to display a non-integer value{' '}
                        </label>
                        <ValidatedInput
                            name="Controlled0"
                            value={value0.toString()}
                            onChange={(v) =>
                                this.setState({
                                    value0: !isNaN(parseInt(v)) ? parseInt(v) : 0,
                                })
                            }
                            showValidation={showValidation}
                            validators={[Validators.greaterThan(10)]}
                        />
                    </div>
                    <div className="form-group">
                        <label>Controlled component with max length 4</label>
                        <ValidatedInput
                            name="Controlled1"
                            value={value1}
                            onChange={(value1) => this.setState({ value1 })}
                            showValidation={showValidation}
                            validators={[Validators.maxLength(4)]}
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            Has value and onChange props, but value starts as undefined
                        </label>
                        <ValidatedInput
                            name="Controlled2"
                            value={value2}
                            onChange={(value2) => this.setState({ value2 })}
                            showValidation={showValidation}
                            validators={[]}
                        />
                        <p className="mb-0">
                            <small>
                                Input should be editable but give a "switching from
                                controlled to uncontrolled is not allowed" warning when
                                you type in it.
                            </small>
                        </p>
                        <p className="mb-0">
                            <small>Current input value: {value2}</small>
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}
