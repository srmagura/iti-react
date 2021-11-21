import React, { useCallback, useState } from 'react'
import { Layout } from 'Components/Layout'
import { Location } from 'history'
import { AppRoutes } from 'AppRoutes'
import { OnReadyArgs } from './useReady'
import { NavbarLink } from 'Components'
import { getAsyncRouter } from '@interface-technologies/iti-react'
import { NProgress, loadNProgress } from 'Components'

const AsyncRouter = getAsyncRouter<OnReadyArgs>()

export function MyAsyncRouter(): React.ReactElement {
    const [activeNavbarLink, setActiveNavbarLink] = useState<NavbarLink>()

    const onReady = useCallback(({ title, activeNavbarLink }: OnReadyArgs): void => {
        document.title = title + ' – ITI React'

        setActiveNavbarLink(activeNavbarLink)
    }, [])

    const onInitialPageReady = useCallback(() => {
        loadNProgress()
        document.getElementById('loadingScreen')?.remove()
    }, [])

    return (
        <AsyncRouter
            renderRoutes={(props) => <AppRoutes {...props} />}
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

    // const myMatchPath = (p: string) => matchPath(pathname, p)

    // // if (myMatchPath(testPaths.routeParam)) return '/test/routeparam'
    // if (arePathsEqual(pathname, '/test/urlSearchParam'))
    //     return '/test/urlsearchparam' + location.search

    return pathname
}
