import * as $ from 'jquery';
import * as React from 'react';

import { Layout } from 'Components/Layout';
import { ViewModel } from 'Models';
import * as Url from 'Url';
import * as UrlUtil from 'Util/UrlUtil';
import * as FormUtil from 'Util/FormUtil';
import { safeFetch, safeFetchRaw } from 'Util/AjaxUtil';

interface IPageProps extends React.Props<any> {
    model: ViewModel
}

interface IPageState {
    numbers: number[]
    serverResponse?: string
}

export class Page extends React.Component<IPageProps, IPageState> {

    formId = 'my-form'

    state: IPageState = {
        numbers: []
    }

    async componentDidMount() {
        const numbers = await safeFetch<number[]>(Url.get_Example_Numbers())
        this.setState({ numbers })
    }

    submitFormAjax = async () => {
        const serverResponse = await FormUtil.submitFormAjax($('#' + this.formId), Url.get_Example_Ajax()) as string
        this.setState({ serverResponse })
    }

    testNoContent = async () => {
        await safeFetchRaw(Url.get_Example_NoContent())
        alert('It worked!')
    }

    testInternalServerError = async () => {
        await safeFetchRaw(Url.get_Example_InternalServerError())
    }

    render() {
        const model = this.props.model
        const { numbers, serverResponse } = this.state

        return (
            <Layout title="Home" pageId="page-example-ajax" model={model}>
                <p>Data retrieved from the backend over AJAX:</p>
                <p>{numbers.join(' ')}</p>
                <p>
                    <button className="btn btn-secondary" onClick={this.testNoContent}>
                        Get 204 No Content
                    </button>{' '}
                    <button className="btn btn-secondary" onClick={this.testInternalServerError}>
                        Get 500 Internal Server Error
                    </button>
                </p>
                <form id={this.formId} method="post">
                    <div className="form-group">
                        <label>Data (leave empty to get an error HTTP status code)</label>
                        <input name="data" className="form-control" />
                    </div>
                    <button type="button" className="btn btn-primary" onClick={this.submitFormAjax}>
                        Submit via AJAX
                    </button>{' '}
                    <input type="submit" className="btn btn-primary" value="Submit normally" />
                    {serverResponse && <p className="text-success">
                        Response from server: {serverResponse}
                    </p>}
                </form>

            </Layout>
        );
    }
}


