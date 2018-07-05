import 'bootstrap'
import '../Styles/app.scss'
import 'react-datepicker/dist/react-datepicker.css'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as $ from 'jquery'
import * as moment from 'moment'
import { AppContainer } from 'react-hot-loader'
import { BrowserRouter } from 'react-router-dom'
import * as ErrorRouterModule from 'Components/Routing/ErrorRouter'
let ErrorRouter = ErrorRouterModule.ErrorRouter
;(window as any).$ = $
;(window as any).moment = moment

function renderApp() {
    const baseUrl = document
        .getElementsByTagName('base')[0]
        .getAttribute('href')!

    ReactDOM.render(
        <AppContainer>
            <BrowserRouter basename={baseUrl}>
                <ErrorRouter />
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
