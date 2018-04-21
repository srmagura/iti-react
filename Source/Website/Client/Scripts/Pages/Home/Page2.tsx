import * as React from 'react';

interface IPageProps extends React.Props<any> {

}

export class Page extends React.Component<IPageProps, {}> {
    render() {
        return <h3>Page2</h3>
    }
}