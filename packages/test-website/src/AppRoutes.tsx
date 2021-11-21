import React, { ReactElement, Suspense } from 'react'
import { HomeRoutes } from 'Pages/Home/HomeRoutes'
import { Route, Routes, Location } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { errorSelector, errorActions } from '_Redux'
import { UrlParamName } from 'Components'

import Error from 'Pages/Home/Error'
const PageNotFound = React.lazy(() => import('Pages/Home/PageNotFound'))

export function AppRoutes(props: { location: Location }): ReactElement {
    const { location, ...incompletePageProps } = props

    const dispatch = useDispatch()
    const onError = (e: any) => dispatch(errorActions.onError(e))

    const pageProps = { ...incompletePageProps, onError }
    const routesProps = { ...props, onError }

    const error = useSelector(errorSelector)
    const urlSearchParams = new URLSearchParams(location.search)

    /*if (urlSearchParams.has(UrlParamName.Error) && error) {
        return (
            <Route
                render={(routeProps) => (
                    <Error error={error} {...routeProps} {...pageProps} />
                )}
            />
        )
    }*/

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
