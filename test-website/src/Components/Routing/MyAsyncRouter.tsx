import React, { useCallback, useState } from 'react'
import { matchPath } from 'react-router-dom'
import { Layout } from 'Components/Layout'
import { Location } from 'history'
import { Routes } from 'Routes'
import { OnReadyArgs } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components'
import { getAsyncRouter, arePathsEqual } from '@interface-technologies/iti-react'
import { paths as testPaths } from 'Pages/Test/TestRoutes'
import { WindowWithGlobals } from 'Components'

// Load NProgress after the initial page load since it is nonessential
function loadNProgress(): void {
    const script = document.createElement('script')
    script.src = '/nprogress/nprogress.min.js'
    document.body.append(script)

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/nprogress/nprogress.min.css'
    document.body.append(link)
}

const _window = window as unknown as WindowWithGlobals
const AsyncRouter = getAsyncRouter<OnReadyArgs>()

export function MyAsyncRouter(): React.ReactElement {
    const [activeNavbarLink, setActiveNavbarLink] = useState<NavbarLink>()

    const onReady = useCallback(({ title, activeNavbarLink }: OnReadyArgs): void => {
        document.title = title + ' – ITI React'

        setActiveNavbarLink(activeNavbarLink)

        if (!_window.NProgress) {
            loadNProgress()
            document.getElementById('loadingScreen')?.remove()
        }
    }, [])

    return (
        <AsyncRouter
            renderRoutes={(args) => <Routes {...args} />}
            renderLayout={(children) => (
                <Layout activeNavbarLink={activeNavbarLink}>{children}</Layout>
            )}
            getLocationKey={getLocationKey}
            onNavigationStart={() => _window.NProgress?.start()}
            onNavigationDone={() => _window.NProgress?.done()}
            onReady={onReady}
        />
    )
}

function getLocationKey(location: Location): string {
    const pathname = location.pathname.toLowerCase()

    const myMatchPath = (p: string) =>
        matchPath(pathname, {
            path: p,
            exact: true,
        })

    if (myMatchPath(testPaths.routeParam)) return '/test/routeparam'
    if (arePathsEqual(pathname, '/test/urlSearchParam'))
        return '/test/urlsearchparam' + location.search

    return pathname
}
