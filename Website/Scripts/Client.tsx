import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';

import { ReactViewModel } from 'Models';

import * as PageUtil from 'Util/PageIndexUtil';

// Import all styles here. Could codegen this
import '../Styles/base.scss';

function renderApp() {
    const reactViewModel = JSON.parse($('#react-view-model').text()) as ReactViewModel;

    ReactDOM.hydrate(
        PageUtil.getPage(reactViewModel),
        $('#react-app')[0]
    );
}

renderApp();
