import React, { ReactElement } from 'react'
import { Route } from 'react-router-dom'

const Form = React.lazy(() => import('./Form/Form'))
const Components = React.lazy(() => import('./Components/Components'))
const Inputs = React.lazy(() => import('./Inputs/Inputs'))
const RouteParam = React.lazy(() => import('./RouteParam'))
const RedirectingPage = React.lazy(() => import('./RedirectingPage'))
const TabManager = React.lazy(() => import('./TabManager/TabManager'))
const UrlSearchParam = React.lazy(() => import('./UrlSearchParam'))
const Hooks = React.lazy(() => import('./Hooks'))
const SpamOnReady = React.lazy(() => import('./SpamOnReady'))
const Popover = React.lazy(() => import('./Popover'))

export function TestRoutes(): ReactElement {
    return (
        <>
            <Route path="/test/form" element={<Form />} />
            <Route path="/test/components" element={<Components />} />
            <Route path="/test/inputs" element={<Inputs />} />
            <Route path="/test/routeParam/:number" element={<RouteParam />} />
            <Route path="/test/redirectingPage" element={<RedirectingPage />} />
            <Route path="/test/tabManager" element={<TabManager />} />
            <Route path="/test/urlSearchParam" element={<UrlSearchParam />} />
            <Route path="/test/hooks" element={<Hooks />} />
            <Route path="/test/spamOnReady" element={<SpamOnReady />} />
            <Route path="/test/popover" element={<Popover />} />
        </>
    )
}
