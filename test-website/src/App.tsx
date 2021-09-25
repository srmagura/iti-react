// Make dynamic imports use the port number that webpack-dev-server
// is running on
__webpack_public_path__ = 'http://localhost:51644/dist/'

import 'bootstrap'
import 'Styles/app.scss'

import * as ReactDOM from 'react-dom'
import $ from 'jquery'
import moment from 'moment-timezone'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from '_Redux'
import { MyAsyncRouter } from 'Components/Routing/MyAsyncRouter'
import { UserGuard, MyErrorRouteSynchronizer } from 'Components/Routing'
;(window as any).$ = $
;(window as any).moment = moment

function renderApp() {
    const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')!

    ReactDOM.render(
        <BrowserRouter basename={baseUrl}>
            <Provider store={store}>
                <MyErrorRouteSynchronizer />
                <UserGuard>
                    <MyAsyncRouter />
                </UserGuard>
            </Provider>
        </BrowserRouter>,
        document.getElementById('react-app')
    )
}

renderApp()
