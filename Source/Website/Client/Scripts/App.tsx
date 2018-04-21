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
import * as RoutesModule from 'Routes';
let routes = RoutesModule.routes;

import { Comp } from './Comp';

function renderApp() {
    const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')!

    ReactDOM.render(
        <AppContainer>
            <BrowserRouter children={routes} basename={baseUrl} />
        </AppContainer>,
        document.getElementById('react-app')
    )
}

renderApp()

// Allow Hot Module Replacement
if (module.hot) {
    module.hot.accept('./Routes', () => {
        routes = require<typeof RoutesModule>('./Routes').routes;
        renderApp();
    });
}

