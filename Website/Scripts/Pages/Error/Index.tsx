import * as React from 'react';

import { Layout } from 'Pages/Layout';
import { HomeErrorViewModel } from 'Models';
import * as Url from 'Url';
import * as UrlUtil from 'Util/UrlUtil';

interface IPageProps extends React.Props<any> {
    model: HomeErrorViewModel
}

export class Page extends React.Component<IPageProps, {}> {

    render() {
        const model = this.props.model

        return (
            <Layout title="Home" pageId="page-error-index" model={model}>
                <div className="alert alert-danger error-message" role="alert">
                    {model.Message}
                </div>
                <div className={model.IsDebug ? '' : 'invisible'}>
                    <h3>Diagnostic information</h3>
                    <p>
                        <small>
                            Visible in DEBUG, invisible but still present in the page for other configurations.
                        </small>
                    </p>
                    {model.DiagnosticInformation}
                </div>
            </Layout>
        )
    }
}


