import * as React from 'react';

import { Layout } from 'Components/Layout';
import { ViewModel } from 'Models';
import * as Url from 'Url';
import * as UrlUtil from 'Util/UrlUtil';
import * as FormUtil from 'Util/FormUtil';

interface IPageProps extends React.Props<any> {
    model: ViewModel
}

interface IPageState {
    numbers: number[]
}

export class Page extends React.Component<IPageProps, IPageState> {

    formId = 'my-form'

    state: IPageState = {
        numbers: []
    }

    async componentDidMount() {
        const result = await fetch(Url.get_Home_Numbers())
        const numbers = await result.json()
        this.setState({ numbers })
    }

    submitForm() {
        FormUtil.submitFormAjax($(this.formId), Url.get_Home_AjaxExample(),
            () => {

            },
            () => {

            })
    }

    render() {
        const model = this.props.model
        const { numbers } = this.state

        return (
            <Layout title="Home" pageId="page-home-index" model={model}>
                <p>Data retrieved from the backend over AJAX:</p>
                <p>{numbers.join(' ')}</p>

                <form onSubmit={this.submitForm}
                    id={formId}>
                    <div className="form-group">
                        <label>Data (leave empty to get an error HTTP status code)</label>
                        <input name="data" className="form-control" />
                    </div>
                    <input type="submit" className="btn btn-primary" value="Submit via AJAX" />
                </form>
            </Layout>
        );
    }
}


