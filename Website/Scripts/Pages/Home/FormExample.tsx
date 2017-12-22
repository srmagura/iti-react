import * as React from 'react';
import { Dispatch } from 'redux';
import { Provider, connect } from 'react-redux';

import { ViewModel } from 'Models';
import { Layout } from 'Pages/Layout';
import * as Url from 'Url';
import * as UrlUtil from 'Util/UrlUtil';

import { ValidatedInput } from 'Util/ValidationLib/ValidatedInput';
import { ReadOnlyInput } from 'Util/ValidationLib/ReadOnlyInput';
import * as Validators from 'Util/ValidationLib/Validators';

interface IPageProps extends React.Props<any> {
    model: ViewModel
}

interface IPageState {
    showValidation: boolean
    value1: string
    value2: string
    value3: string
    value4: string
    value5: string
}

export class Page extends React.Component<IPageProps, IPageState> {

    state = {
        showValidation: false,
        value1: '',
        value2: '',
        value3: '',
        value4: '',
        value5: '',
    }

    submit() {
        this.setState({ showValidation: true })
        return false
    }

    render() {
        const model = this.props.model
        const { showValidation, value1, value2, value3, value4, value5 } = this.state

        return (
            <Layout title="Form Example" pageId="page-home-form-example" model={model}>
                <form onSubmit={() => this.submit()}>
                    <div className="form-group">
                        <label>Required</label>
                        <ValidatedInput name="Input1"
                            value={value1}
                            onChange={value1 => this.setState({ value1 })}
                            showValidation={showValidation}
                            validators={[Validators.Required()]} />
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
                            validators={[Validators.MaxLength(5)]} />
                    </div>
                    <div className="form-group">
                        <label>Required and max length = 10</label>
                        <ValidatedInput name="Input3"
                                        value={value3}
                                        onChange={value3 => this.setState({ value3 })}
                                        showValidation={showValidation}
                                        validators={[Validators.Required(), Validators.MaxLength(10)]} />
                    </div>
                    <div className="form-group">
                        <label>Min length = 5 and max length = 10</label>
                        <ValidatedInput name="Input4"
                                        value={value4}
                                        onChange={value4 => this.setState({ value4 })}
                                        showValidation={showValidation}
                                        validators={[Validators.MinLength(5), Validators.MaxLength(10)]} />
                    </div>
                    <div className="form-group">
                        <label>Must be numeric</label>
                        <ValidatedInput name="Input5"
                                        value={value5}
                                        onChange={value5 => this.setState({ value5 })}
                                        showValidation={showValidation}
                                        validators={[Validators.Number()]} />
                    </div>
                    <input type="button" className="btn btn-primary" value="Submit" onClick={() => this.submit()} />
                </form>
            </Layout>
        )

    }
}


