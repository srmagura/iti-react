import React, { ReactElement } from 'react'
import { Route } from 'react-router-dom'

const Index = React.lazy(() => import('./Index'))
const LogIn = React.lazy(() => import('./LogIn'))

export function HomeRoutes(): ReactElement {
    return (
        <>
            <Route path="/home" element={<Index />} />
            <Route path="/home/logIn" element={<LogIn />} />
        </>
    )
}
