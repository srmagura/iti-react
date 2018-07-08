import * as React from 'react'
import {
    IRoutesProps,
    ILocalRoutesProps,
    passPageProps,
    CustomLoadable
} from 'Components/Routing/RouteProps'
import {
    getProtectedRouteBuilder,
    getUnprotectedRouteBuilder
} from 'Components/Routing/ProtectedRoute'

const Form = CustomLoadable(() => import('./Form').then(m => m.Page))
const Components = CustomLoadable(() => import('./Components').then(m => m.Page))
const Inputs = CustomLoadable(() => import('./Inputs').then(m => m.Page))
const UrlParam = CustomLoadable(() => import('./UrlParam').then(m => m.Page))
const RedirectingPage = CustomLoadable(() =>
    import('./RedirectingPage').then(m => m.Page)
)
const TabLayout = CustomLoadable(() => import('./TabLayout').then(m => m.Page))

export function getTestRoutes(props: IRoutesProps) {
    const { location, computedMatch, ...pageProps } = props as ILocalRoutesProps

    const ppp = passPageProps(pageProps)
    const protectedRoute = getProtectedRouteBuilder(location, computedMatch)

    return [
        protectedRoute('/test/form', ppp(Form)),
        protectedRoute('/test/components', ppp(Components)),
        protectedRoute('/test/inputs', ppp(Inputs)),
        protectedRoute('/test/urlParam/:number', ppp(UrlParam)),
        protectedRoute('/test/redirectingPage', ppp(RedirectingPage)),
        protectedRoute('/test/tabLayout', ppp(TabLayout))
    ]
}
