import * as React from 'react';

import { Layout } from 'Components/Layout';
import { ErrorIndexViewModel } from 'Models';
import * as Url from 'Url';
import * as UrlUtil from 'Util/UrlUtil';

interface IPageProps extends React.Props<any> {
    model: ErrorIndexViewModel
}

export class Page extends React.Component<IPageProps, {}> {

    render() {
        const model = this.props.model

        return (
            <Layout title="Home" pageId="page-error-index" model={model}>
               
            </Layout>
        )
    }
}


