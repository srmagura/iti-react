import * as React from 'react';

import { IPageProps } from 'Components/RouteProps';
import { NavbarLink } from 'Components/Header';
import { ValidatedInput, ReadOnlyInput, Validators, IValidationFeedbackProps } from 'Util/ValidationLib';

interface IPageState {
    showValidation: boolean
    value1: string
    value2: string
    value3: string
    value4: string
    value5: string
    value6: string
    value7: string
    value10: number
    value11: string
}

export class Page extends React.Component<IPageProps, IPageState> {

    state = {
        showValidation: true,
        value1: '',
        value2: '',
        value3: '',
        value4: '',
        value5: '',
        value6: '',
        value7: '',
        value10: 0,
        value11: '',
    }

    componentDidMount() {
        const { onReady } = this.props

        onReady({
            title: 'Index',
            activeNavbarLink: NavbarLink.Index,
            pageId: 'page-home-index'
        })
    }


    render() {
        if (!this.props.ready) return null

        const {
            showValidation, value1, value2, value3, value4, value5, value6,
            value7, value10, value11
        } = this.state

        function validationFeedbackComponent(props: IValidationFeedbackProps) {
            const { children, valid, showValidation, invalidFeedback } = props

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
                        value={value1}
                        onChange={value1 => this.setState({ value1 })}
                        showValidation={showValidation}
                        validators={[Validators.required()]} />
                </div>
                <div className="form-group">
                    <label>Readonly input (does not get focused when tabbing through form)</label>
                    <ReadOnlyInput value="Read only value" />
                </div>
                <div className="form-group">
                    <label>Max length = 5</label>
                    <ValidatedInput name="Input2"
                        value={value2}
                        onChange={value2 => this.setState({ value2 })}
                        showValidation={showValidation}
                        validators={[Validators.maxLength(5)]} />
                </div>
                <div className="form-group">
                    <label>Required and max length = 10</label>
                    <ValidatedInput name="Input3"
                        value={value3}
                        onChange={value3 => this.setState({ value3 })}
                        showValidation={showValidation}
                        validators={[Validators.required(), Validators.maxLength(10)]} />
                </div>
                <div className="form-group">
                    <label>Min length = 5 and max length = 10</label>
                    <ValidatedInput name="Input4"
                        value={value4}
                        onChange={value4 => this.setState({ value4 })}
                        showValidation={showValidation}
                        validators={[Validators.minLength(5), Validators.maxLength(10)]} />
                </div>
                <div className="form-group">
                    <label>Must be numeric</label>
                    <ValidatedInput name="Input5"
                        value={value5}
                        onChange={value5 => this.setState({ value5 })}
                        showValidation={showValidation}
                        validators={[Validators.number()]} />
                </div>
                <div className="form-group">
                    <label>Must be integer</label>
                    <ValidatedInput name="Input6"
                        value={value6}
                        onChange={value6 => this.setState({ value6 })}
                        showValidation={showValidation}
                        validators={[Validators.integer()]} />
                </div>
                <div className="form-group">
                    <label>Greater than 4.7 and less than 5</label>
                    <ValidatedInput name="Input7"
                        value={value7}
                        onChange={value7 => this.setState({ value7 })}
                        showValidation={showValidation}
                        validators={[Validators.greaterThan(4.7), Validators.lessThan(5)]} />
                </div>
                <div className="form-group">
                    <label>No value or default value</label>
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
                        value={value10.toString()}
                        onChange={v => this.setState({ value10: !isNaN(parseInt(v)) ? parseInt(v) : 0 })}
                        showValidation={showValidation}
                        validators={[Validators.greaterThan(10)]} />
                </div>
                <div className="form-group">
                    <label>Controlled component with no special rules </label>
                    <ValidatedInput name="Input11"
                        value={value11}
                        onChange={value11 => this.setState({ value11 })}
                        showValidation={showValidation}
                        validators={[]} />
                </div>
            </form>
        )

    }
}


