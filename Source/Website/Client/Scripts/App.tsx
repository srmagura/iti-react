import 'bootstrap'
import '../Styles/app.scss'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-hint/css/index.css'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as $ from 'jquery'
import * as moment from 'moment'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import { BrowserRouter } from 'react-router-dom'
import { store } from 'AppState'
import * as ErrorRouterModule from 'Components/Routing/ErrorRouter'
import { getRandomId } from '@interface-technologies/iti-react'
let ErrorRouter = ErrorRouterModule.ErrorRouter
;(window as any).$ = $
;(window as any).moment = moment
;(window as any).getRandomId = getRandomId

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
