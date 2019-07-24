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

// No dynamic import for Error page since we want it to work even if we lose internet
import { Page as Error } from './Error'

const Index = CustomLoadable(() => import('./Index').then(m => m.Page) as any) as any
export const LogIn = CustomLoadable(
    () => import('./LogIn').then(m => m.Page) as any
) as any

export function getHomeRoutes(props: RoutesProps) {
    const { location, computedMatch, ...pageProps } = props as LocalRoutesProps

    const ppp = passPageProps(pageProps)
    const protectedRoute = getProtectedRouteBuilder(location, computedMatch)
    const unprotectedRoute = getUnprotectedRouteBuilder(location, computedMatch)

    return [
        protectedRoute('/home/index', ppp(Index)),
        unprotectedRoute('/home/error', ppp(Error)),
        unprotectedRoute('/home/logIn', ppp(LogIn))
    ]
}
