import * as React from 'react';
import { Dispatch } from 'redux';
import { Provider, connect } from 'react-redux';

import { ViewModel } from 'Models';
import { Layout } from 'Pages/Layout';
import * as Url from 'Url';
import * as UrlUtil from 'Util/UrlUtil';

import { store, incrementClicks, IState } from './ReduxExampleState';

interface IContentPresentationProps extends React.Props<any> {
    numberOfClicks: number
    dispatch: Dispatch<any>
}

function ContentPresentation(props: IContentPresentationProps) {
    return <div>
        <p>Number of clicks (stored in Redux): {props.numberOfClicks}</p>
        <button className="btn btn-primary" onClick={() => props.dispatch(incrementClicks())}>Click me!</button>
    </div>
}

function mapStateToProps(state: IState) {
    return {
        numberOfClicks: state.numberOfClicks
    }
}

const Content = connect(mapStateToProps)(ContentPresentation)

interface IPageProps extends React.Props<any> {
    model: ViewModel
}

export class Page extends React.Component<IPageProps, {}> {

    render() {
        const model = this.props.model

        return (
            <Layout title="Redux Example" pageId="page-home-redux-example" model={model}>
                <Provider store={store}>
                    <Content />
                </Provider>
            </Layout>
        )
    }
}


