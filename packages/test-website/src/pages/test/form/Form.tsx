import { ReactElement, useEffect } from 'react'
import { NavbarLink } from 'components'
import {
    ValidatedInput,
    Validators,
    MoneyInputContainer,
    UnitInputContainer,
    FormGroup,
} from '@interface-technologies/iti-react'
import { useReady } from 'components/routing'
import { AsyncValidationSection } from './AsyncValidationSection'
import { ChangeValidatorSection } from './ChangeValidatorSection'
import { FormGroupSection } from './FormGroupSection'
import { ControlledComponentSection } from './ControlledComponentSection'

const showValidation = true

export default function Page(): ReactElement {
    const { onReady } = useReady()

    useEffect(() => {
        onReady({
            title: 'Form test',
            activeNavbarLink: NavbarLink.Index,
        })
    }, [onReady])

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
                    <FormGroup label="Max length = 5  (loading = true)" loading>
                        <ValidatedInput
                            name="Input2"
                            showValidation={showValidation}
                            validators={[Validators.maxLength(5)]}
                        />
                    </FormGroup>
                    <FormGroup label="Required and max length = 10">
                        {(id) => (
                            <ValidatedInput
                                id={id}
                                name="Input3"
                                showValidation={showValidation}
                                validators={[
                                    Validators.required(),
                                    Validators.maxLength(10),
                                ]}
                            />
                        )}
                    </FormGroup>
                    <FormGroup label="Min length = 5 and max length = 10">
                        {(id) => (
                            <ValidatedInput
                                id={id}
                                name="Input4"
                                showValidation={showValidation}
                                validators={[
                                    Validators.minLength(5),
                                    Validators.maxLength(10),
                                ]}
                            />
                        )}
                    </FormGroup>
                    <FormGroup label="Optional number">
                        {(id) => (
                            <ValidatedInput
                                id={id}
                                name="Input5"
                                showValidation={showValidation}
                                validators={[Validators.number()]}
                            />
                        )}
                    </FormGroup>
                    <FormGroup label="Optional integer">
                        {(id) => (
                            <ValidatedInput
                                id={id}
                                name="Input6"
                                showValidation={showValidation}
                                validators={[Validators.integer()]}
                            />
                        )}
                    </FormGroup>
                    <FormGroup label="Required integer">
                        {(id) => (
                            <ValidatedInput
                                id={id}
                                name="Input6"
                                showValidation={showValidation}
                                validators={[Validators.required(), Validators.integer()]}
                            />
                        )}
                    </FormGroup>
                    <FormGroup label="Greater than 4.7 and less than 5">
                        {(id) => (
                            <ValidatedInput
                                id={id}
                                name="Input7"
                                showValidation={showValidation}
                                validators={[
                                    Validators.greaterThan(4.7),
                                    Validators.lessThan(5),
                                ]}
                            />
                        )}
                    </FormGroup>
                    <FormGroup label="Greater than or equal to 4.7 and less than or equal to 5">
                        {(id) => (
                            <ValidatedInput
                                id={id}
                                name="input232"
                                showValidation={showValidation}
                                validators={[
                                    Validators.greaterThanOrEqual(4.7),
                                    Validators.lessThanOrEqual(5),
                                ]}
                            />
                        )}
                    </FormGroup>
                    <FormGroup label="Textarea">
                        {(id) => (
                            <ValidatedInput
                                id={id}
                                name="Input8"
                                type="textarea"
                                showValidation={showValidation}
                                validators={[]}
                                inputAttributes={{ rows: 4 }}
                            />
                        )}
                    </FormGroup>
                    <FormGroup label="Email address">
                        {(id) => (
                            <ValidatedInput
                                id={id}
                                name="Input9"
                                showValidation={showValidation}
                                validators={[Validators.email()]}
                            />
                        )}
                    </FormGroup>
                    <FormGroup label="Money">
                        {(id) => (
                            <MoneyInputContainer>
                                <ValidatedInput
                                    id={id}
                                    name="Input10"
                                    showValidation={showValidation}
                                    validators={[Validators.money()]}
                                />
                            </MoneyInputContainer>
                        )}
                    </FormGroup>
                    <FormGroup label="Money (allow negative)">
                        {(id) => (
                            <MoneyInputContainer>
                                <ValidatedInput
                                    id={id}
                                    name="Input104896"
                                    showValidation={showValidation}
                                    validators={[
                                        Validators.money({ allowNegative: true }),
                                    ]}
                                />
                            </MoneyInputContainer>
                        )}
                    </FormGroup>
                    <FormGroup label="UnitInputContainer">
                        {(id) => (
                            <UnitInputContainer unit="kg">
                                <ValidatedInput
                                    id={id}
                                    name="unitInputContainer"
                                    showValidation={showValidation}
                                    validators={[]}
                                />
                            </UnitInputContainer>
                        )}
                    </FormGroup>
                </div>
            </div>
            <ControlledComponentSection showValidation={showValidation} />
            <AsyncValidationSection showValidation={showValidation} />
            <ChangeValidatorSection showValidation={showValidation} />
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Misc</h5>
                    <FormGroup label="Form-level validation">
                        {(id) => (
                            <ValidatedInput
                                id={id}
                                name="Input15"
                                showValidation={showValidation}
                                validators={[Validators.required()]}
                                formLevelValidatorOutput="Doesn't satisfy some cross-field constraint"
                            />
                        )}
                    </FormGroup>
                </div>
            </div>
            <FormGroupSection />
        </form>
    )
}
