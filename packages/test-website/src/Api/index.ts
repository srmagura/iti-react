import { formatUrlParams } from '@interface-technologies/iti-react'
import { productApi as product } from 'Api/ProductApi'
import { userApi as user } from 'Api/UserApi'
import { appPermissionsApi as appPermissions } from 'Api/AppPermissionsApi'

export const api = {
    appPermissions,
    product,
    user,
}

// for easy debugging
;(window as any).api = api
;(window as any).formatUrlParams = formatUrlParams
