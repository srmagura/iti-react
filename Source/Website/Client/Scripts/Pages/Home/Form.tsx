import * as React from 'react';

import { IPageProps } from 'Components/Routing/RouteProps';
import { NavbarLink } from 'Components/Header';
import {
    ValidatedInput, Validators, IValidationFeedbackProps, IValidatorOutput,
    ICancellablePromise, cancellableThen, IFieldValidity, childValidChange, cancellableResolve, AsyncValidator
} from 'Util/ITIReact';
import { api } from 'Api';

interface IAsyncValidationSectionProps extends React.Props<any> {
    showValidation: boolean
}

interface IAsyncValidationSectionState {
    fieldValidity: IFieldValidity
    inProgress: boolean
}

class AsyncValidationSection extends React.Component<IAsyncValidationSectionProps, IAsyncValidationSectionState> {

    state: IAsyncValidationSectionState = {
        fieldValidity: {},
        inProgress: false,
    }

    childValidChange = (fieldName: string, valid: boolean) => {
        childValidChange(fieldName, valid, f => this.setState(f))
    }

    render() {
        const { showValidation } = this.props
        const { fieldValidity, inProgress } = this.state

        return (
            <div className="card">
            <div className="card-body">
                <h5 className="card-title">Async Validation</h5>
                <div className="form-group">
                        <label>{`Must contain "cool" and be at least 4 characters - valid: ${fieldValidity.Input0 === true}`}</label>
                    <ValidatedInput name="Input0"
                        showValidation={showValidation}
                        validators={[Validators.minLength(4)]}
                        defaultValue="default value"
                        onValidChange={this.childValidChange}
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
                    <label>InternalServerError - check console to see error from server</label>
                    <ValidatedInput name="Input1"
                        showValidation={showValidation}
                        validators={[]}
                        onValidChange={this.childValidChange}
                        asyncValidator={value => api.product.internalServerError({}) as any}
                        onAsyncError={e => {
                            console.log('Received async error:')
                            console.log(e)
                        }} />
                </div>
                <div className="form-group">
                    <label>Test that blank field gets validated - should have an validation error message below</label>
                    <ValidatedInput name="Input2"
                        showValidation={showValidation}
                        validators={[]}
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
                    <label>Test that blank field gets validated - should be successful</label>
                    <ValidatedInput name="Input2"
                                    showValidation={showValidation}
                                    validators={[]}
                            asyncValidator={value => cancellableResolve({ valid: true, invalidFeedback: 'No feedback' })} />
                </div>
                <div className="form-group">
                        <label>onAsyncValidationInProgressChange test - inProgress = {inProgress.toString()}</label>
                        <ValidatedInput name="Input3"
                            showValidation={showValidation}
                            validators={[]}
                            asyncValidator={value => {
                                const apiCallPromise = api.product.isValid({ s: value })
                                return cancellableThen(apiCallPromise, ({ valid, reason }) => ({
                                    valid,
                                    invalidFeedback: `The server says your input is invalid because: ${reason}`
                                })
                                )
                            }} onAsyncValidationInProgressChange={inProgress => this.setState({ inProgress })} />
                </div>
            </div>
            </div>
        )
    }
}

interface IOptions0 {
    required: boolean
    maxLength: boolean
}

interface IOptions1 {
    maxLength: boolean
    mustContain: 'cool' | 'nice' | undefined
}

interface IChangeValidatorSectionProps extends React.Props<any> {
    showValidation: boolean
}

interface IChangeValidatorSectionState {
    fieldValidity: IFieldValidity
    options0: IOptions0
    options1: IOptions1
}

class ChangeValidatorSection extends React.Component<IChangeValidatorSectionProps, IChangeValidatorSectionState> {

    state: IChangeValidatorSectionState = {
        fieldValidity: {},
        options0: {
            required: false,
            maxLength: false,
        },
        options1: {
            maxLength: false,
            mustContain: undefined,
        },
    }

    childValidChange = (fieldName: string, valid: boolean) => {
        childValidChange(fieldName, valid, f => this.setState(f))
    }

    setOptions0 = (deltaFunc: (options0: IOptions0) => IOptions0) => {
        this.setState(s => ({
            ...s,
            options0: deltaFunc(s.options0)
        }))
    }

    setOptions1 = (deltaFunc: (options1: IOptions1) => IOptions1) => {
        this.setState(s => ({
            ...s,
            options1: deltaFunc(s.options1)
        }))
    }
  
    getAsyncValidator = (mustContain: 'cool' | 'nice' | undefined) => {
        if (!mustContain) return undefined

        return (value: string) => {
            const apiCallPromise = mustContain === 'cool'
                ? api.product.isValid({ s: value })
                : api.product.isValid2({ s: value })
            return cancellableThen(apiCallPromise,
                ({ valid, reason }) => ({
                    valid,
                    invalidFeedback: `The server says your input is invalid because: ${reason}`
                })
            )
        }
    }

    render() {
        const { showValidation } = this.props
        const { fieldValidity, options0, options1 } = this.state

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
                                <input type="checkbox" checked={options0.required} onChange={() => this.setOptions0(v => ({ ...v, required: !v.required }))} />{' '}
                            Required
                            </label>    
                            <label>
                                <input type="checkbox" checked={options0.maxLength} onChange={() => this.setOptions0(v => ({ ...v, maxLength: !v.maxLength }))} />{' '}
                                Max length = {maxLength} 
                            </label>    
                            <span>Valid = {(fieldValidity.Input0 === true).toString()}</span>
                        </label>
                        <ValidatedInput name="Input0"
                            showValidation={showValidation}
                            validators={validators0}
                            onValidChange={this.childValidChange}
                            validationKey={JSON.stringify(options0)} />
                    </div>
                    <div className="form-group">
                        <label className="space-children">
                            <label>
                                <input type="checkbox" checked={options1.maxLength} onChange={() => this.setOptions1(v => ({ ...v, maxLength: !v.maxLength }))} />{' '}
                                Max length = {maxLength}
                            </label>
                            <label>
                                <input type="radio" name="asyncValidator1" checked={options1.mustContain === 'cool'}
                                    onChange={() => this.setOptions1(v => ({ ...v, mustContain: 'cool' }))} />{' '}
                                Must contain cool
                            </label>
                            <label>
                                <input type="radio" name="asyncValidator1" checked={options1.mustContain === 'nice'}
                                       onChange={() => this.setOptions1(v => ({ ...v, mustContain: 'nice' }))} />{' '}
                                Must contain nice
                            </label>
                            <label>
                                <input type="radio" name="asyncValidator1" checked={!options1.mustContain}
                                       onChange={() => this.setOptions1(v => ({ ...v, mustContain: undefined }))} />{' '}
                                Neither
                            </label>
                            <span>Valid = {(fieldValidity.Input1 === true).toString()}</span>
                        </label>
                        <ValidatedInput name="Input1"
                            showValidation={showValidation}
                            validators={validators1}
                            onValidChange={this.childValidChange}
                            asyncValidator={this.getAsyncValidator(options1.mustContain)}
                            validationKey={JSON.stringify(options1)}/>
                    </div>
                </div>
            </div>
        )
    }
}

interface IPageState {
    showValidation: boolean
    value0: number
    value1: string
}

export class Page extends React.Component<IPageProps, IPageState> {

    state: IPageState = {
        showValidation: true,
        value0: 0,
        value1: '',
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
            showValidation, value0, value1
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
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Basic</h5>
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
                    </div></div>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Controlled Component</h5>
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
                    </div></div>
                <AsyncValidationSection showValidation={showValidation} />
                <ChangeValidatorSection showValidation={showValidation} />
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Misc</h5>
                        <div className="form-group">
                            <label>Form-level validation</label>
                            <ValidatedInput name="Input15"
                                showValidation={showValidation}
                                validators={[Validators.required()]}
                                formLevelValidatorOutput={{
                                    valid: false,
                                    invalidFeedback: "Doesn't satisfy some cross-field constraint"
                                }} />
                        </div>
                    </div>
                </div>
            </form>
        )

    }
}


