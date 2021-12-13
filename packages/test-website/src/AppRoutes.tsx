import React, { ReactElement, Suspense } from 'react'
import { getHomeRoutes } from 'pages/home/homeRoutes'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectError } from '_redux'
import { getTestRoutes } from 'pages/test/testRoutes'
import { UrlParamName } from '_constants'
import Error from 'pages/home/Error'
import { useReady } from 'components/routing'

const PageNotFound = React.lazy(() => import('pages/home/PageNotFound'))

export function AppRoutes(): ReactElement {
    const { ready, location } = useReady()

    const error = useSelector(selectError)
    const urlSearchParams = new URLSearchParams(location.search)

    if (urlSearchParams.has(UrlParamName.Error) && error) {
        return <Error error={error} />
    }

    return (
        <div hidden={!ready}>
            <Suspense fallback={null}>
                <Routes location={location}>
                    {getHomeRoutes()}
                    {getTestRoutes()}
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </Suspense>
        </div>
    )
}
