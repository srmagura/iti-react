// Make dynamic imports use the port number that webpack-dev-server
// is running on
import 'bootstrap'
import 'Styles/app.scss'

import ReactDOM from 'react-dom'
import moment from 'moment-timezone'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from '_Redux'
import { MyAsyncRouter } from 'Components/Routing/MyAsyncRouter'
import { UserGuard, MyErrorRouteSynchronizer } from 'Components/Routing'
import { ItiReactContext, ItiReactCoreContext } from '@interface-technologies/iti-react'
import { getItiReactCoreContextData, itiReactContextData } from 'Components'

/* eslint-disable */
;

__webpack_public_path__ = 'http://localhost:51644/dist/'(window as any).moment = moment
/* eslint-disable */

function renderApp() {
    const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')!

    ReactDOM.render(
        <BrowserRouter basename={baseUrl}>
            <Provider store={store}>
                <ItiReactContext.Provider value={itiReactContextData}>
                    <ItiReactCoreContext.Provider
                        value={getItiReactCoreContextData(store.dispatch)}
                    >
                        <MyErrorRouteSynchronizer />
                        <UserGuard>
                            <MyAsyncRouter />
                        </UserGuard>
                    </ItiReactCoreContext.Provider>
                </ItiReactContext.Provider>
            </Provider>
        </BrowserRouter>,
        document.getElementById('reactApp')
    )
}

renderApp()
