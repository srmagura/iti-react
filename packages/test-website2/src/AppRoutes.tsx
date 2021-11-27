import React, { ReactElement, Suspense } from 'react'
import { getHomeRoutes } from 'Pages/Home/homeRoutes'
import { Route, Routes, Navigate, Location } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectError } from '_Redux'
import { getTestRoutes } from 'Pages/Test/testRoutes'
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
                {getHomeRoutes()}
                {getTestRoutes()}
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </Suspense>
    )
}
