import 'babel-polyfill';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';

declare const require: any
require('expose-loader?$!jquery')

import 'bootstrap';

import '../Styles/base.scss';

function renderApp() {
    const reactContainer = $('<div id="react-app"></div>')
    $('body').prepend(reactContainer)

    ReactDOM.render(
        <div>Hello!</div>,
        reactContainer[0]
    )
}

renderApp()
