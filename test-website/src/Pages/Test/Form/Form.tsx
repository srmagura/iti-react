import React from 'react'
import { PageProps } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components'
import {
    ValidatedInput,
    Validators,
    ValidationFeedbackProps,
    getGuid,
    MoneyInputContainer,
    UnitInputContainer,
} from '@interface-technologies/iti-react'
import { FormGroup } from 'Components/FormGroup'
import { AsyncValidationSection } from './AsyncValidationSection'
import { ControlledComponentSection } from './ControlledComponentSection'
import { ChangeValidatorSection } from './ChangeValidatorSection'

interface PageState {
    showValidation: boolean
}

export default class Page extends React.Component<PageProps, PageState> {
    state: PageState = {
        showValidation: true,
    }

    componentDidMount() {
        const { onReady } = this.props

        onReady({
            title: 'Form test',
            activeNavbarLink: NavbarLink.Index,
        })
    }

    render() {
        if (!this.props.ready) return null

        const { showValidation } = this.state

        function validationFeedbackComponent(props: ValidationFeedbackProps) {
            const { children, valid, invalidFeedback } = props

            let feedback = undefined
            if (showValidation && !valid) {
                feedback = <h3>{invalidFeedback}</h3>
            }

            return (
                <div>
                    {children}
                    {feedback}
                </div>
            )
        }

        return (
            <form className="page-test-form">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Basic</h5>
                        <FormGroup label="Required">
                            {(id) => (
                                <ValidatedInput
                                    id={id}
                                    name="Input1"
                                    showValidation={showValidation}
                                    validators={[Validators.required()]}
                                />
                            )}
                        </FormGroup>
                        <div className="form-group">
                            <label>Max length = 5</label>
                            <ValidatedInput
                                name="Input2"
                                showValidation={showValidation}
                                validators={[Validators.maxLength(5)]}
                            />
                        </div>
                        <div className="form-group">
                            <label>Required and max length = 10</label>
                            <ValidatedInput
                                name="Input3"
                                showValidation={showValidation}
                                validators={[
                                    Validators.required(),
                                    Validators.maxLength(10),
                                ]}
                            />
                        </div>
                        <div className="form-group">
                            <label>Min length = 5 and max length = 10</label>
                            <ValidatedInput
                                name="Input4"
                                showValidation={showValidation}
                                validators={[
                                    Validators.minLength(5),
                                    Validators.maxLength(10),
                                ]}
                            />
                        </div>
                        <div className="form-group">
                            <label>Optional number</label>
                            <ValidatedInput
                                name="Input5"
                                showValidation={showValidation}
                                validators={[Validators.number()]}
                            />
                        </div>
                        <div className="form-group">
                            <label>Optional integer</label>
                            <ValidatedInput
                                name="Input6"
                                showValidation={showValidation}
                                validators={[Validators.integer()]}
                            />
                        </div>
                        <div className="form-group">
                            <label>Required integer</label>
                            <ValidatedInput
                                name="Input6"
                                showValidation={showValidation}
                                validators={[Validators.required(), Validators.integer()]}
                            />
                        </div>
                        <div className="form-group">
                            <label>Greater than 4.7 and less than 5</label>
                            <ValidatedInput
                                name="Input7"
                                showValidation={showValidation}
                                validators={[
                                    Validators.greaterThan(4.7),
                                    Validators.lessThan(5),
                                ]}
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                Greater than or equal to 4.7 and less than or equal to 5
                            </label>
                            <ValidatedInput
                                name={'input' + getGuid()}
                                showValidation={showValidation}
                                validators={[
                                    Validators.greaterThanOrEqual(4.7),
                                    Validators.lessThanOrEqual(5),
                                ]}
                            />
                        </div>
                        <div className="form-group">
                            <label>Textarea</label>
                            <ValidatedInput
                                name="Input8"
                                type="textarea"
                                showValidation={showValidation}
                                validators={[]}
                                inputAttributes={{ rows: 4 }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email address</label>
                            <ValidatedInput
                                name="Input9"
                                showValidation={showValidation}
                                validators={[Validators.email()]}
                                validationFeedbackComponent={validationFeedbackComponent}
                            />
                        </div>
                        <div className="form-group">
                            <label>Money</label>
                            <MoneyInputContainer>
                                <ValidatedInput
                                    name="Input10"
                                    showValidation={showValidation}
                                    validators={[Validators.money()]}
                                />
                            </MoneyInputContainer>
                        </div>
                        <div className="form-group">
                            <label>Money (allow negative)</label>
                            <MoneyInputContainer>
                                <ValidatedInput
                                    name="Input104896"
                                    showValidation={showValidation}
                                    validators={[
                                        Validators.money({ allowNegative: true }),
                                    ]}
                                />
                            </MoneyInputContainer>
                        </div>
                        <div className="form-group">
                            <label>UnitInputContainer</label>
                            <UnitInputContainer unit="kg">
                                <ValidatedInput
                                    name="unitInputContainer"
                                    showValidation={showValidation}
                                    validators={[]}
                                />
                            </UnitInputContainer>
                        </div>
                    </div>
                </div>
                <ControlledComponentSection showValidation={showValidation} />
                <AsyncValidationSection showValidation={showValidation} />
                <ChangeValidatorSection showValidation={showValidation} />
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Misc</h5>
                        <div className="form-group">
                            <label>Form-level validation</label>
                            <ValidatedInput
                                name="Input15"
                                showValidation={showValidation}
                                validators={[Validators.required()]}
                                formLevelValidatorOutput={{
                                    valid: false,
                                    invalidFeedback:
                                        "Doesn't satisfy some cross-field constraint",
                                }}
                            />
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}
