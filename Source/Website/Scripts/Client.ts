import 'babel-polyfill';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';

declare const require: any
require('expose-loader?$!jquery')

import 'bootstrap';

import { ReactViewModel } from 'Models';

import { getPage } from 'Util/Plumbing/GetPage';

import '../Styles/base.scss';

//import * as PageIndex from 'Pages/PageIndex';

async function renderApp() {
    const reactViewModel = JSON.parse($('#react-view-model').text()) as ReactViewModel

    ReactDOM.hydrate(
        await getPage(reactViewModel),
        document.getElementById('react-app')
    )
}

renderApp()
