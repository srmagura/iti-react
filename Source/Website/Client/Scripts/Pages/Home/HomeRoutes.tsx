import * as React from 'react'
import { Route, Redirect, Switch, RouteComponentProps } from 'react-router-dom'
import { Location } from 'history'
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

// No dynamic import for Error page since we want it to work even if we lose internet
import { Page as Error } from './Error'

const Index = CustomLoadable(() => import('./Index').then(m => m.Page))
const Form = CustomLoadable(() => import('./Form').then(m => m.Page))
const Components = CustomLoadable(() => import('./Components').then(m => m.Page))
const Inputs = CustomLoadable(() => import('./Inputs').then(m => m.Page))
const UrlParam = CustomLoadable(() => import('./UrlParam').then(m => m.Page))
const RedirectingPage = CustomLoadable(() =>
    import('./RedirectingPage').then(m => m.Page)
)
const TabLayout = CustomLoadable(() => import('./TabLayout').then(m => m.Page))

export const LogIn = CustomLoadable(() => import('./LogIn').then(m => m.Page))
export const LogOut = CustomLoadable(() => import('./LogOut').then(m => m.Page))

export function getHomeRoutes(props: IRoutesProps) {
    const { location, computedMatch, ...pageProps } = props as ILocalRoutesProps

    const ppp = passPageProps(pageProps)
    const protectedRoute = getProtectedRouteBuilder(location, computedMatch)
    const unprotectedRoute = getUnprotectedRouteBuilder(location, computedMatch)

    return [
        protectedRoute('/home/index', ppp(Index)),
        protectedRoute('/home/form', ppp(Form)),
        protectedRoute('/home/components', ppp(Components)),
        protectedRoute('/home/inputs', ppp(Inputs)),
        protectedRoute('/home/urlParam/:number', ppp(UrlParam)),
        protectedRoute('/home/redirectingPage', ppp(RedirectingPage)),
        protectedRoute('/home/tabLayout', ppp(TabLayout)),
        unprotectedRoute('/home/error', ppp(Error)),
        unprotectedRoute('/home/logIn', ppp(LogIn)),
        unprotectedRoute('/home/logOut', ppp(LogOut))
    ]
}
