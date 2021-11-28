import { Protected } from 'components/routing'
import React, { ReactElement } from 'react'
import { Route } from 'react-router-dom'

const Index = React.lazy(() => import('./Index'))
const LogIn = React.lazy(() => import('./LogIn'))

export function getHomeRoutes(): ReactElement {
    return (
        <>
            <Route
                path="/home"
                element={
                    <Protected>
                        <Index />
                    </Protected>
                }
            />
            <Route path="/home/logIn" element={<LogIn />} />
        </>
    )
}
