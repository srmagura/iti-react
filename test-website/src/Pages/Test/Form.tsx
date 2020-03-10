import React, { useState } from 'react'
import { PageProps } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components'
import {
    ValidatedInput,
    Validators,
    ValidationFeedbackProps,
    CancellablePromise,
    FieldValidity,
    SubmitButton,
    areAnyInProgress,
    getGuid,
    useFieldValidity,
    useValidationInProgressMonitor,
    AsyncValidator
} from '@interface-technologies/iti-react'
import { api } from 'Api'
import { FormGroup } from 'Components/FormGroup'

interface AsyncValidationSectionProps {
    showValidation: boolean
}

function AsyncValidationSection(props: AsyncValidationSectionProps) {
    const { showValidation } = props

    const [onChildValidChange, fieldValidity] = useFieldValidity()
    const [onChildProgressChange, validationProgress] = useValidationInProgressMonitor()
    const validationInProgress = areAnyInProgress({
        ...validationProgress,
        Input1: false
    })

    const vProps = {
        showValidation,
        onValidChange: onChildValidChange,
        onAsyncValidationInProgressChange: onChildProgressChange
    }

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Async Validation</h5>
                <div className="form-group">
                    <label>{`Must contain "cool" and be at least 4 characters - valid: ${(
                        fieldValidity.Input0 === true
                    ).toString()}`}</label>
                    <ValidatedInput
                        name="Input0"
                        validators={[Validators.required(), Validators.minLength(4)]}
                        defaultValue="default value"
                        asyncValidator={value => {
                            return api.product
                                .isValid({
                                    s: value
                                })
                                .then(({ valid, reason }) => ({
                                    valid,
                                    invalidFeedback: `The server says your input is invalid because: ${reason}`
                                }))
                        }}
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label>
                        InternalServerError - check console to see error from server
                    </label>
                    <ValidatedInput
                        name="Input1"
                        validators={[]}
                        asyncValidator={() => api.product.internalServerError({}) as any}
                        onAsyncError={e => {
                            console.log('Received async error:')
                            console.log(e)
                        }}
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label>
                        Test that blank field gets validated - should have an validation
                        error message below
                    </label>
                    <ValidatedInput
                        name="Input2"
                        validators={[]}
                        asyncValidator={value => {
                            return api.product
                                .isValid({
                                    s: value
                                })
                                .then(({ valid, reason }) => ({
                                    valid,
                                    invalidFeedback: `The server says your input is invalid because: ${reason}`
                                }))
                        }}
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label>
                        Test that blank field gets validated - should be successful
                    </label>
                    <ValidatedInput
                        name="Input2"
                        validators={[]}
                        asyncValidator={() =>
                            CancellablePromise.resolve({
                                valid: true,
                                invalidFeedback: 'No feedback'
                            })
                        }
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label>
                        useValidationInProgressMonitor test - validationInProgress ={' '}
                        {validationInProgress.toString()} - ignores InternalServerError
                        input
                    </label>
                    <div>
                        <SubmitButton
                            type="button"
                            onClick={() =>
                                console.log(
                                    'Would have submitted the form (if it is valid).'
                                )
                            }
                            submitting={false}
                            className="btn btn-primary"
                            enabled={!validationInProgress}
                        >
                            Submit
                        </SubmitButton>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface Options0 {
    required: boolean
    maxLength: boolean
}

interface Options1 {
    maxLength: boolean
    mustContain: 'cool' | 'nice' | undefined
}

interface ChangeValidatorSectionProps {
    showValidation: boolean
}

function ChangeValidatorSection(props: ChangeValidatorSectionProps) {
    const { showValidation } = props

    const [onChildValidChange, fieldValidity] = useFieldValidity()
    const vProps = { showValidation, onValidChange: onChildValidChange }

    const [options0, setOptions0] = useState<Options0>({
        required: false,
        maxLength: false
    })
    const [options1, setOptions1] = useState<Options1>({
        maxLength: false,
        mustContain: undefined
    })

    function getAsyncValidator(
        mustContain: 'cool' | 'nice' | undefined
    ): AsyncValidator<string> | undefined {
        if (!mustContain) return undefined

        return (value: string) => {
            const apiCallPromise =
                mustContain === 'cool'
                    ? api.product.isValid({ s: value })
                    : api.product.isValid2({ s: value })

            return apiCallPromise.then(({ valid, reason }) => ({
                valid,
                invalidFeedback: `The server says your input is invalid because: ${reason}`
            }))
        }
    }

    const maxLength = 5

    const validators0 = []
    if (options0.required) {
        validators0.push(Validators.required())
    }

    if (options0.maxLength) {
        validators0.push(Validators.maxLength(maxLength))
    }

    const validators1 = []
    if (options1.maxLength) {
        validators1.push(Validators.maxLength(maxLength))
    }

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Changeable Validators</h5>
                <div className="form-group">
                    <label className="space-children">
                        <label>
                            <input
                                type="checkbox"
                                checked={options0.required}
                                onChange={() =>
                                    setOptions0(o => ({
                                        ...o,
                                        required: !o.required
                                    }))
                                }
                            />{' '}
                            Required
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={options0.maxLength}
                                onChange={() =>
                                    setOptions0(o => ({
                                        ...o,
                                        maxLength: !o.maxLength
                                    }))
                                }
                            />{' '}
                            Max length = {maxLength}
                        </label>
                        <span>Valid = {(fieldValidity.Input0 === true).toString()}</span>
                    </label>
                    <ValidatedInput
                        name="Input0"
                        validators={validators0}
                        validationKey={JSON.stringify(options0)}
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label className="space-children">
                        <label>
                            <input
                                type="checkbox"
                                checked={options1.maxLength}
                                onChange={() =>
                                    setOptions1(o => ({
                                        ...o,
                                        maxLength: !o.maxLength
                                    }))
                                }
                            />{' '}
                            Max length = {maxLength}
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="asyncValidator1"
                                checked={options1.mustContain === 'cool'}
                                onChange={() =>
                                    setOptions1(o => ({
                                        ...o,
                                        mustContain: 'cool'
                                    }))
                                }
                            />{' '}
                            Must contain cool
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="asyncValidator1"
                                checked={options1.mustContain === 'nice'}
                                onChange={() =>
                                    setOptions1(o => ({
                                        ...o,
                                        mustContain: 'nice'
                                    }))
                                }
                            />{' '}
                            Must contain nice
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="asyncValidator1"
                                checked={!options1.mustContain}
                                onChange={() =>
                                    setOptions1(o => ({
                                        ...o,
                                        mustContain: undefined
                                    }))
                                }
                            />{' '}
                            Neither
                        </label>
                        <span>Valid = {(fieldValidity.Input1 === true).toString()}</span>
                    </label>
                    <ValidatedInput
                        name="Input1"
                        validators={validators1}
                        asyncValidator={getAsyncValidator(options1.mustContain)}
                        validationKey={JSON.stringify(options1)}
                        {...vProps}
                    />
                </div>
            </div>
        </div>
    )
}

interface ControlledComponentSectionProps {
    showValidation: boolean
}

interface ControlledComponentSectionState {
    value0: number
    value1: string
    value2?: string
}

class ControlledComponentSection extends React.Component<
    ControlledComponentSectionProps,
    ControlledComponentSectionState
> {
    state: ControlledComponentSectionState = {
        value0: 0,
        value1: ''
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
                            onChange={v =>
                                this.setState({
                                    value0: !isNaN(parseInt(v)) ? parseInt(v) : 0
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
                            onChange={value1 => this.setState({ value1 })}
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
                            onChange={value2 => this.setState({ value2 })}
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

interface PageState {
    showValidation: boolean
}

export default class Page extends React.Component<PageProps, PageState> {
    state: PageState = {
        showValidation: true
    }

    componentDidMount() {
        const { onReady } = this.props

        onReady({
            title: 'Form test',
            activeNavbarLink: NavbarLink.Index
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
                            {id => (
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
                                    Validators.maxLength(10)
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
                                    Validators.maxLength(10)
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
                                    Validators.lessThan(5)
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
                                    Validators.lessThanOrEqual(5)
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
                            <div className="dollar-sign-input-container">
                                <div className="dollar-sign">$</div>
                                <ValidatedInput
                                    name="Input10"
                                    showValidation={showValidation}
                                    validators={[Validators.money()]}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Money (allow negative)</label>
                            <div className="dollar-sign-input-container">
                                <div className="dollar-sign">$</div>
                                <ValidatedInput
                                    name="Input104896"
                                    showValidation={showValidation}
                                    validators={[
                                        Validators.money({ allowNegative: true })
                                    ]}
                                />
                            </div>
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
                                        "Doesn't satisfy some cross-field constraint"
                                }}
                            />
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}
