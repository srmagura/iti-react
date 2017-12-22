import * as React from 'react';

import { ViewModel } from 'Models';

import { Header } from 'Components/Header';
import { Footer } from 'Components/Footer';

interface ILayoutProps extends React.Props<any> {
    title: string
    pageId: string
    model: ViewModel
}

export function Layout(props: ILayoutProps) {
    // data-title attribute is parsed by the Razor to set the <title>
    let { children, model } = props

    return (
        <div id={props.pageId} data-title={props.title} className="layout">
            <Header />
            <div className="body-content">
                <div className="container">
                    {children}
                </div>
            </div>
            <Footer />
        </div>
    )
}