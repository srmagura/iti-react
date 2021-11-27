import React, { ReactElement } from 'react'
import { Route, Routes } from 'react-router-dom'

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
        <Routes>
            <Route path="form" element={<Form />} />
            <Route path="components" element={<Components />} />
            <Route path="inputs" element={<Inputs />} />
            <Route path="routeParam/:number" element={<RouteParam />} />
            <Route path="redirectingPage" element={<RedirectingPage />} />
            <Route path="tabManager" element={<TabManager />} />
            <Route path="urlSearchParam" element={<UrlSearchParam />} />
            <Route path="hooks" element={<Hooks />} />
            <Route path="spamOnReady" element={<SpamOnReady />} />
            <Route path="popover" element={<Popover />} />
        </Routes>
    )
}
