import 'babel-polyfill';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';

declare const require: any
require('expose-loader?$!jquery')

import 'bootstrap';

import '../Styles/base.scss';

import { Comp } from './Comp';

function renderApp() {
    ReactDOM.render(
        <div>Hello!<Comp/></div>,
        document.getElementById('react-app')
    )
}

renderApp()
