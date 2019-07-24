import {
    RoutesProps,
    LocalRoutesProps,
    passPageProps
} from 'Components/Routing/RouteProps'
import { getProtectedRouteBuilder } from 'Components/Routing/ProtectedRoute'
import { CustomLoadable } from '@interface-technologies/iti-react'

const List = CustomLoadable(() => import('./List').then(m => m.Page))
const ListDataUpdater = CustomLoadable(() =>
    import('./ListDataUpdater').then(m => m.Page)
)
const Detail = CustomLoadable(() => import('./Detail').then(m => m.Page))

export function getProductRoutes(props: RoutesProps) {
    const { location, computedMatch, ...pageProps } = props as LocalRoutesProps

    const ppp = passPageProps(pageProps)
    const protectedRoute = getProtectedRouteBuilder(location, computedMatch)

    return [
        protectedRoute('/product/list', ppp(ListDataUpdater)),
        protectedRoute('/product/listDataUpdater', ppp(ListDataUpdater)),
        protectedRoute('/product/detail/:id', ppp(Detail))
    ]
}
