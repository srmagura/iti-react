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
            <Layout title="Home" pageId="page-home-error" model={model}>
                <p>My custom error page!</p>
                <p>Message: {model.Message}</p>
            </Layout>
        )
    }
}


