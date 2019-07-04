import {
    RoutesProps,
    LocalRoutesProps,
    passPageProps
} from 'Components/Routing/RouteProps'
import {
    getProtectedRouteBuilder,
    getUnprotectedRouteBuilder
} from 'Components/Routing/ProtectedRoute'
import { CustomLoadable } from '@interface-technologies/iti-react'

const Form = CustomLoadable(() => import('./Form').then(m => m.Page))
const Components = CustomLoadable(() => import('./Components').then(m => m.Page))
const Inputs = CustomLoadable(() => import('./Inputs/Inputs').then(m => m.Page))
const RouteParam = CustomLoadable(() => import('./RouteParam').then(m => m.Page))
const RedirectingPage = CustomLoadable(() =>
    import('./RedirectingPage').then(m => m.Page)
)
const CancellablePromise = CustomLoadable(() =>
    import('./CancellablePromise').then(m => m.Page)
)
const TabManager = CustomLoadable(() =>
    import('./TabManager/TabManager').then(m => m.Page)
)
const UrlSearchParam = CustomLoadable(() => import('./UrlSearchParam').then(m => m.Page))
const Hooks = CustomLoadable(() => import('./Hooks').then(m => m.Page))

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
        protectedRoute('/test/cancellablePromise', ppp(CancellablePromise)),
        protectedRoute('/test/tabManager', ppp(TabManager)),
        protectedRoute('/test/urlSearchParam', ppp(UrlSearchParam)),
        protectedRoute('/test/hooks', ppp(Hooks)),
    ]
}
