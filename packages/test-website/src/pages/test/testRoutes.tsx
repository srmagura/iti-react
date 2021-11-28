import { Protected } from 'components/routing'
import React, { ReactElement } from 'react'
import { Route } from 'react-router-dom'

const Form = React.lazy(() => import('./form/Form'))
const Components = React.lazy(() => import('./components/Components'))
const Inputs = React.lazy(() => import('./inputs/Inputs'))
const RouteParam = React.lazy(() => import('./RouteParam'))
const RedirectingPage = React.lazy(() => import('./RedirectingPage'))
const TabManager = React.lazy(() => import('./tabManager/TabManager'))
const UrlSearchParam = React.lazy(() => import('./UrlSearchParam'))
const Hooks = React.lazy(() => import('./Hooks'))
const SpamOnReady = React.lazy(() => import('./SpamOnReady'))
const Popover = React.lazy(() => import('./Popover'))

export function getTestRoutes(): ReactElement {
    return (
        <>
            <Route
                path="/test/form"
                element={
                    <Protected>
                        <Form />
                    </Protected>
                }
            />
            <Route
                path="/test/components"
                element={
                    <Protected>
                        <Components />
                    </Protected>
                }
            />
            <Route
                path="/test/inputs"
                element={
                    <Protected>
                        <Inputs />
                    </Protected>
                }
            />
            <Route
                path="/test/routeParam/:number"
                element={
                    <Protected>
                        <RouteParam />
                    </Protected>
                }
            />
            <Route
                path="/test/redirectingPage"
                element={
                    <Protected>
                        <RedirectingPage />
                    </Protected>
                }
            />
            <Route
                path="/test/tabManager"
                element={
                    <Protected>
                        <TabManager />
                    </Protected>
                }
            />
            <Route
                path="/test/urlSearchParam"
                element={
                    <Protected>
                        <UrlSearchParam />
                    </Protected>
                }
            />
            <Route
                path="/test/hooks"
                element={
                    <Protected>
                        <Hooks />
                    </Protected>
                }
            />
            <Route
                path="/test/spamOnReady"
                element={
                    <Protected>
                        <SpamOnReady />
                    </Protected>
                }
            />
            <Route
                path="/test/popover"
                element={
                    <Protected>
                        <Popover />
                    </Protected>
                }
            />
        </>
    )
}
