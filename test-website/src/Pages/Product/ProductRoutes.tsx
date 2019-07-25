import {
    RoutesProps,
    LocalRoutesProps,
    passPageProps
} from 'Components/Routing/RouteProps'
import { getProtectedRouteBuilder } from 'Components/Routing/ProtectedRoute'
import { CustomLoadable } from '@interface-technologies/iti-react'

const List = CustomLoadable(() => import('./List/List').then(m => m.Page) as any) as any
const ListDataUpdater = CustomLoadable(
    () => import('./ListDataUpdater').then(m => m.Page) as any
) as any
const Detail = CustomLoadable(() => import('./Detail').then(m => m.Page) as any) as any

export function getProductRoutes(props: RoutesProps) {
    const { location, computedMatch, ...pageProps } = props as LocalRoutesProps

    const ppp = passPageProps(pageProps)
    const protectedRoute = getProtectedRouteBuilder(location, computedMatch)

    return [
        protectedRoute('/product/list', ppp(List)),
        protectedRoute('/product/listDataUpdater', ppp(ListDataUpdater)),
        protectedRoute('/product/detail/:id', ppp(Detail))
    ]
}
