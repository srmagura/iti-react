import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';

import 'bootstrap';
import 'babel-polyfill';

import { ReactViewModel } from 'Models';

import { getPage } from 'Util/GetPage';

import '../Styles/base.scss';

async function renderApp() {
    const reactViewModel = JSON.parse($('#react-view-model').text()) as ReactViewModel

    ReactDOM.hydrate(
        await getPage(reactViewModel),
        document.getElementById('react-app')
    )
}

renderApp()
