import React, { ReactElement } from 'react'
import {
    RoutesProps,
    LocalRoutesProps,
    passPageProps,
} from 'Components/Routing/RouteProps'
import {
    getProtectedRouteBuilder,
    getUnprotectedRouteBuilder,
} from 'Components/Routing/ProtectedRoute'
import { Route, Routes } from 'react-router-dom'

const Index = React.lazy(() => import('./Index'))
const LogIn = React.lazy(() => import('./LogIn'))

export function HomeRoutes(): ReactElement {
    return (
        <Routes>
            <Route path="/" element={<Index />} />
        </Routes>
    )

    // return [
    //     protectedRoute('/', ppp(Index)),
    //     unprotectedRoute('/home/logIn', ppp(LogIn)),
    // ]
}
