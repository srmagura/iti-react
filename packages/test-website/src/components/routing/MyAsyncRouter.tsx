import React, { useCallback, useState } from 'react'
import { Layout } from 'components/Layout'
import { AppRoutes } from 'AppRoutes'
import { NavbarLink, NProgress, loadNProgress } from 'components'
import { getAsyncRouter } from '@interface-technologies/iti-react'
import { Location, matchPath } from 'react-router-dom'
import { OnReadyArgs } from './useReady'

const AsyncRouter = getAsyncRouter<OnReadyArgs>()

export function MyAsyncRouter(): React.ReactElement {
    const [activeNavbarLink, setActiveNavbarLink] = useState<NavbarLink>()

    const onReady = useCallback(({ title, activeNavbarLink }: OnReadyArgs): void => {
        document.title = `${title} – ITI React`

        setActiveNavbarLink(activeNavbarLink)
    }, [])

    const onInitialPageReady = useCallback(() => {
        loadNProgress()
        document.getElementById('loadingScreen')?.remove()
    }, [])

    return (
        <AsyncRouter
            routesElement={<AppRoutes />}
            renderLayout={(children) => (
                <Layout activeNavbarLink={activeNavbarLink}>{children}</Layout>
            )}
            getLocationKey={getLocationKey}
            onNavigationStart={NProgress.start}
            onNavigationDone={NProgress.done}
            onReady={onReady}
            onInitialPageReady={onInitialPageReady}
        />
    )
}

function getLocationKey(location: Location): string {
    const pathname = location.pathname.toLowerCase()

    if (matchPath('/test/routeParam/:number', pathname)) return '/test/routeparam'

    if (pathname === '/test/urlsearchparam') return `${pathname}?${location.search}`

    return pathname
}
