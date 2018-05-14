import 'babel-polyfill';

//declare const require: any
require('expose-loader?$!jquery')

import 'bootstrap';
import '../Styles/base.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import * as ErrorRouterModule from 'Components/Routing/ErrorRouter';
let ErrorRouter = ErrorRouterModule.ErrorRouter;

function renderApp() {
    const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')!

    ReactDOM.render(
        <AppContainer>
            <BrowserRouter basename={baseUrl}>
                <ErrorRouter />
            </BrowserRouter>
        </AppContainer>,
        document.getElementById('react-app')
    )
}

renderApp()

// Allow Hot Module Replacement
if ((window as any).isDebug && module.hot) {
    module.hot.accept('./Components/Routing/ErrorRouter', () => {
        ErrorRouter = require<typeof ErrorRouterModule>('./Components/Routing/ErrorRouter').ErrorRouter;
        renderApp();
    });
}

