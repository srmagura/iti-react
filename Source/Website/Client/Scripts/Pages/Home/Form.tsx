import * as React from 'react';

import { IPageProps } from 'Components/Routing/RouteProps';
import { NavbarLink } from 'Components/Header';
import { ValidatedInput, Validators, IValidationFeedbackProps, IValidatorOutput,
    ICancellablePromise, cancellableThen } from 'Util/ITIReact';
import { api } from 'Api';

interface IPageState {
    showValidation: boolean
    value0: number
    value1: string
    input12Valid: boolean
}

export class Page extends React.Component<IPageProps, IPageState> {

    state: IPageState = {
        showValidation: true,
        value0: 0,
        value1: '',
        input12Valid: false
    }

    componentDidMount() {
        const { onReady } = this.props

        onReady({
            title: 'Form test',
            activeNavbarLink: NavbarLink.Index,
            pageId: 'page-home-form'
        })
    }

    render() {
        if (!this.props.ready) return null

        const {
            showValidation, value0, value1, input12Valid
        } = this.state

        function validationFeedbackComponent(props: IValidationFeedbackProps) {
            const { children, valid, invalidFeedback } = props

            let feedback = undefined
            if (showValidation && !valid) {
                feedback = <h3>{invalidFeedback}</h3>
            }

            return <div>
                {children}
                {feedback}
            </div>
        }

        return (
            <form>
                <div className="form-group">
                    <label>Required</label>
                    <ValidatedInput name="Input1"
                        showValidation={showValidation}
                        validators={[Validators.required()]} />
                </div>
                <div className="form-group">
                    <label>Max length = 5</label>
                    <ValidatedInput name="Input2"
                        showValidation={showValidation}
                        validators={[Validators.maxLength(5)]} />
                </div>
                <div className="form-group">
                    <label>Required and max length = 10</label>
                    <ValidatedInput name="Input3"
                        showValidation={showValidation}
                        validators={[Validators.required(), Validators.maxLength(10)]} />
                </div>
                <div className="form-group">
                    <label>Min length = 5 and max length = 10</label>
                    <ValidatedInput name="Input4"
                        showValidation={showValidation}
                        validators={[Validators.minLength(5), Validators.maxLength(10)]} />
                </div>
                <div className="form-group">
                    <label>Optional number</label>
                    <ValidatedInput name="Input5"
                        showValidation={showValidation}
                        validators={[Validators.number()]} />
                </div>
                <div className="form-group">
                    <label>Optional integer</label>
                    <ValidatedInput name="Input6"
                        showValidation={showValidation}
                        validators={[Validators.integer()]} />
                </div>
                <div className="form-group">
                    <label>Required integer</label>
                    <ValidatedInput name="Input6"
                                    showValidation={showValidation}
                                    validators={[Validators.required(), Validators.integer()]} />
                </div>
                <div className="form-group">
                    <label>Greater than 4.7 and less than 5</label>
                    <ValidatedInput name="Input7"
                        showValidation={showValidation}
                        validators={[Validators.greaterThan(4.7), Validators.lessThan(5)]} />
                </div>
                <div className="form-group">
                    <label>Textarea</label>
                    <ValidatedInput name="Input8"
                        type="textarea"
                        showValidation={showValidation}
                        validators={[]}
                        inputAttributes={{ rows: 4 }} />
                </div>
                <div className="form-group">
                    <label>Email address</label>
                    <ValidatedInput name="Input9"
                        showValidation={showValidation}
                        validators={[Validators.email()]}
                        validationFeedbackComponent={validationFeedbackComponent} />
                </div>
                <div className="form-group">
                    <label>ValidatedInput as a controlled component - should be impossible to get field to display a non-integer value </label>
                    <ValidatedInput name="Input10"
                        value={value0.toString()}
                        onChange={v => this.setState({ value0: !isNaN(parseInt(v)) ? parseInt(v) : 0 })}
                        showValidation={showValidation}
                        validators={[Validators.greaterThan(10)]} />
                </div>
                <div className="form-group">
                    <label>Controlled component with max length 4</label>
                    <ValidatedInput name="Input11"
                        value={value1}
                        onChange={value1 => this.setState({ value1 })}
                        showValidation={showValidation}
                        validators={[Validators.maxLength(4)]} />
                </div>
                <div className="form-group">
                    <label>{`Async validation (valid: ${input12Valid}) - must contain "cool" and be at least 4 characters`}</label>
                    <ValidatedInput name="Input12"
                        showValidation={showValidation}
                        validators={[Validators.minLength(4)]}
                        defaultValue="default value"
                        onValidChange={valid => this.setState({ input12Valid: valid })}
                        asyncValidator={value => {
                            const apiCallPromise = api.product.isValid({ s: value })
                            return cancellableThen(apiCallPromise, ({ valid, reason }) => ({
                                    valid,
                                    invalidFeedback: `The server says your input is invalid because: ${reason}`
                                })
                            )
                        }} />
                </div>
                <div className="form-group">
                    <label>Async validation - check console to see error from server</label>
                    <ValidatedInput name="Input13"
                        showValidation={showValidation}
                        validators={[]}
                        onValidChange={valid => this.setState({ input12Valid: valid })}
                        asyncValidator={value => api.product.internalServerError({}) as any}
                        onAsyncError={e => {
                            console.log('Received async error:')
                            console.log(e)
                        }}/>
                </div>
                <div className="form-group">
                    <label>Form-level validation</label>
                    <ValidatedInput name="Input14"
                                    showValidation={showValidation}
                        validators={[Validators.required()]}
                        formLevelValidatorOutput={{
                            valid: false,
                            invalidFeedback: "Doesn't satisfy some cross-field constraint" 
                        }}/>
                </div>
            </form>
        )

    }
}


