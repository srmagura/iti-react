import * as moment from 'moment';
import * as React from 'react';

import { Layout } from 'Components/Layout';
import { ViewModel } from 'Models';
import * as DateTimeUtil from 'Util/DateTimeUtil';

interface IPageProps extends React.Props<any> {
    model: ViewModel
}

export class Page extends React.Component<IPageProps, {}> {

    render() {
        const model = this.props.model

        return (
            <Layout title="Home" pageId="page-home-index" model={model}>
                <p>Normal datetime: {DateTimeUtil.formatDateTime(moment())}</p>
                <p>Friendly datetime: {DateTimeUtil.formatFriendlyDateTime(moment())}</p>
                <p>Date: {DateTimeUtil.formatDate(moment())}</p>
            </Layout>
        )
    }
}