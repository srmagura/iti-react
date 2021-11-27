import React, { ReactElement } from 'react'
import { Route, Routes } from 'react-router-dom'

const Index = React.lazy(() => import('./Index'))
const LogIn = React.lazy(() => import('./LogIn'))
const PageNotFound = React.lazy(() => import('./PageNotFound'))

export function HomeRoutes(): ReactElement {
    return (
        <Routes>
            <Route index element={<Index />} />
            <Route path="logIn" element={<LogIn />} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    )
}
