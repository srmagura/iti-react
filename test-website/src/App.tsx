// Make dynamic imports use the port number that webpack-dev-server
// is running on
__webpack_public_path__ = 'http://localhost:51644/dist/'

import 'bootstrap'
import 'Styles/app.scss'
import 'react-hint/css/index.css'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as $ from 'jquery'
import * as moment from 'moment-timezone'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import { BrowserRouter } from 'react-router-dom'
import { store } from 'AppState'
import * as ErrorRouterModule from 'Components/Routing/ErrorRouter'
let ErrorRouter = ErrorRouterModule.ErrorRouter
;(window as any).$ = $
;(window as any).moment = moment

function renderApp() {
    const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')!

    ReactDOM.render(
        <AppContainer>
            <BrowserRouter basename={baseUrl}>
                <Provider store={store}>
                    <ErrorRouter />
                </Provider>
            </BrowserRouter>
        </AppContainer>,
        document.getElementById('react-app')
    )
}

renderApp()

// Allow Hot Module Replacement
if ((window as any).isDebug && module.hot) {
    module.hot.accept('./Components/Routing/ErrorRouter', () => {
        ErrorRouter = require<
            typeof ErrorRouterModule
        >('./Components/Routing/ErrorRouter').ErrorRouter
        renderApp()
    })
}
