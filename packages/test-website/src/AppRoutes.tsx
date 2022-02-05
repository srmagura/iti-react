import React, { ReactElement, Suspense, useEffect } from 'react'
import { getHomeRoutes } from 'pages/home/homeRoutes'
import {
    Route,
    Routes,
    // eslint-disable-next-line no-restricted-imports
    useLocation,
    useNavigate,
    matchPath,
} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectAuthBootstrapped, selectAuthenticated, selectError } from '_redux'
import { getTestRoutes } from 'pages/test/testRoutes'
import { UrlParamName } from '_constants'
import Error from 'pages/home/Error'
import { useReady } from 'components/routing'

const PageNotFound = React.lazy(() => import('pages/home/PageNotFound'))

function useBaseUrlRedirect(): void {
    const realLocation = useLocation()
    const navigate = useNavigate()

    const authenticated = useSelector(selectAuthenticated)
    const authBootstrapped = useSelector(selectAuthBootstrapped)

    // Have to be careful to avoid multiple redirects
    useEffect(() => {
        if (matchPath('/', realLocation.pathname) && authBootstrapped) {
            const redirectPath = authenticated ? '/home' : '/home/logIn'

            navigate(redirectPath, { replace: true })
        }
    }, [realLocation.pathname, navigate, authBootstrapped, authenticated])
}

export function AppRoutes(): ReactElement {
    useBaseUrlRedirect()

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
                    <Route path="/" element={null} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </Suspense>
        </div>
    )
}
