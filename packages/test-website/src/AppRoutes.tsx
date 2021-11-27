import React, { ReactElement, Suspense } from 'react'
import { HomeRoutes } from 'Pages/Home/HomeRoutes'
import { Route, Routes, Location } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectError } from '_Redux'

import Error from 'Pages/Home/Error'

const PageNotFound = React.lazy(() => import('Pages/Home/PageNotFound'))

interface AppRoutesProps {
    location: Location
}

export function AppRoutes({ location }: AppRoutesProps): ReactElement {
    const error = useSelector(selectError)
    const urlSearchParams = new URLSearchParams(location.search)

    /* if (urlSearchParams.has(UrlParamName.Error) && error) {
        return (
            <Route
                render={(routeProps) => (
                    <Error error={error} {...routeProps} {...pageProps} />
                )}
            />
        )
    } */

    return (
        <Suspense fallback={null}>
            <Routes location={location}>
                <Route path="home/*" element={<HomeRoutes />} />
                {/* <Route
                    path="/"
                    render={() => <Redirect to="/home/index" push={false} />}
                />
                <Route render={ppp(PageNotFound)} /> */}
            </Routes>
        </Suspense>
    )
}
