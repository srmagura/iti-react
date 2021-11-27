import React, { ReactElement } from 'react'
import { Route, Routes } from 'react-router-dom'

const Index = React.lazy(() => import('./Index'))
const LogIn = React.lazy(() => import('./LogIn'))

export function HomeRoutes(): ReactElement {
    return (
        <Routes>
            <Route path="/" element={<Index />} />
            <Route path="logIn" element={<LogIn />} />
        </Routes>
    )
}
