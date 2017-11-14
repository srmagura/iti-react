import * as React from 'react';

import { Layout } from 'Pages/Layout';
import { HomeIndexViewModel } from 'Models';
import * as Url from 'Url';
import * as UrlUtil from 'Util/UrlUtil';

interface IPageProps extends React.Props<any> {
    model: HomeIndexViewModel
}

export class Page extends React.Component<IPageProps, {}> {

    render() {
        const model = this.props.model;

        return (
            <Layout title="Home" pageId="page-home-index" model={model}>
                <p>Here's some data from the backend:</p>
                <pre>{JSON.stringify(model.User)}</pre>

                <p>Check out the <a href={Url.get_Home_ReduxExample()}>Redux example</a>.</p>
                <p>Check out the <a href={Url.get_Home_FormExample()}>Form example</a>.</p>
                <p>
                    <a href={Url.get_Home_Index() + UrlUtil.formatUrlParams({simulateError: true})}>
                        Throw an exception in the controller method 
                        </a>
                    &nbsp;to see a custom error page when not in DEBUG
                </p>
                <p>
                    <a href={Url.get_Home_Index() + UrlUtil.formatUrlParams({ simulateErrorRedirect: true })}>
                        Redirect me to an error page with a message
                    </a>
                </p>
            </Layout>
        );
    }
}


