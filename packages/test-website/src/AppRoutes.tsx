import React, { ReactElement, Suspense } from 'react'
import { HomeRoutes } from 'Pages/Home/HomeRoutes'
import { Route, Routes, Navigate, Location } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectError } from '_Redux'
import { TestRoutes } from 'Pages/Test/TestRoutes'
import { UrlParamName } from '_constants'
import Error from 'Pages/Home/Error'

const PageNotFound = React.lazy(() => import('Pages/Home/PageNotFound'))

export interface MyRoutesProps {
    location: Location
}

export function AppRoutes({ location }: MyRoutesProps): ReactElement {
    const error = useSelector(selectError)
    const urlSearchParams = new URLSearchParams(location.search)

    if (urlSearchParams.has(UrlParamName.Error) && error) {
        return <Error error={error} />
    }

    return (
        <Suspense fallback={null}>
            <Routes location={location}>
                {HomeRoutes()}
                {TestRoutes()}
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </Suspense>
    )
}
