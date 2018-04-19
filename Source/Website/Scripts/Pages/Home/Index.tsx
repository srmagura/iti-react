import * as React from 'react';

import { Layout } from 'Components/Layout';
import { HomeIndexViewModel } from 'Models';
import * as Url from 'Url';
import * as UrlUtil from 'Util/UrlUtil';

interface IPageProps extends React.Props<any> {
    model: HomeIndexViewModel
}

export class Page extends React.Component<IPageProps, {}> {

    render() {
        const model = this.props.model

        return (
            <Layout title="Home" pageId="page-home-index" model={model}>
                <p>Here's some data from the backend:</p>
                <pre>{JSON.stringify(model.user)}</pre>

                <p><a href={Url.get_Example_Form()}>Form example</a></p>
                <p><a href={Url.get_Example_Ajax()}>AJAX example</a></p>
                <p><a href={Url.get_Example_DateTime()}>Datetime example</a></p>
                <p>
                    <a href={Url.get_Example_InternalServerError()}>
                        Throw an exception in a controller method
                    </a>
                </p>
            </Layout>
        );
    }
}