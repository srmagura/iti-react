import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';
import { Provider } from 'react-redux';

import { MetaViewModel } from 'Models';

import * as PageUtil from 'Util/PageIndexUtil';

// Import all styles here. Could codegen this
import '../Styles/base.scss';

function renderApp() {
    const metaViewModel = JSON.parse($('#meta-view-model').text()) as MetaViewModel;

    ReactDOM.render(
        PageUtil.getPage(metaViewModel),
        $('#react-app')[0]
    );
}

renderApp();