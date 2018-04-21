import * as React from 'react';
import * as DocumentTitle from 'react-document-title';
import { appTitle } from 'Components/Title';

import { Header } from 'Components/Header';
import { Footer } from 'Components/Footer';

interface ILayoutProps extends React.Props<any> {
    //title: string
   // pageId: string
}

export function Layout(props: ILayoutProps) {
    const { children } = props

    return (
        <DocumentTitle title={appTitle}>
        <div className="layout">
            <Header />
            <div className="body-content">
                <div className="container">
                    {children}
                </div>
            </div>
            <Footer />
            </div>
        </DocumentTitle>
    )
}