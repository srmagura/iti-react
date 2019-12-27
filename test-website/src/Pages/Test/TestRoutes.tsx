import {
    RoutesProps,
    LocalRoutesProps,
    passPageProps
} from 'Components/Routing/RouteProps'
import { getProtectedRouteBuilder } from 'Components/Routing/ProtectedRoute'
import { CustomLoadable } from '@interface-technologies/iti-react'

const Form = CustomLoadable(() => import('./Form').then(m => m.Page) as any) as any
const Components = CustomLoadable(
    () => import('./Components/Components').then(m => m.Page) as any
) as any
const Inputs = CustomLoadable(
    () => import('./Inputs/Inputs').then(m => m.Page) as any
) as any
const RouteParam = CustomLoadable(
    () => import('./RouteParam').then(m => m.Page) as any
) as any
const RedirectingPage = CustomLoadable(
    () => import('./RedirectingPage').then(m => m.Page) as any
) as any
const TabManager = CustomLoadable(
    () => import('./TabManager/TabManager').then(m => m.Page) as any
) as any
const UrlSearchParam = CustomLoadable(
    () => import('./UrlSearchParam').then(m => m.Page) as any
) as any
const Hooks = CustomLoadable(() => import('./Hooks').then(m => m.Page) as any) as any
const SpamOnReady = CustomLoadable(() =>
    import('./SpamOnReady').then(m => m.Page as any)
) as any

export const paths = {
    routeParam: '/test/routeParam/:number'
}

export function getTestRoutes(props: RoutesProps) {
    const { location, computedMatch, ...pageProps } = props as LocalRoutesProps

    const ppp = passPageProps(pageProps)
    const protectedRoute = getProtectedRouteBuilder(location, computedMatch)

    return [
        protectedRoute('/test/form', ppp(Form)),
        protectedRoute('/test/components', ppp(Components)),
        protectedRoute('/test/inputs', ppp(Inputs)),
        protectedRoute(paths.routeParam, ppp(RouteParam)),
        protectedRoute('/test/redirectingPage', ppp(RedirectingPage)),
        protectedRoute('/test/tabManager', ppp(TabManager)),
        protectedRoute('/test/urlSearchParam', ppp(UrlSearchParam)),
        protectedRoute('/test/hooks', ppp(Hooks)),
        protectedRoute('/test/spamOnReady', ppp(SpamOnReady))
    ]
}
