import { productApi as product } from 'Api/ProductApi'
import { logApi as log } from 'Api/LogApi'
import { userApi as user } from 'Api/UserApi'
import { formatUrlParams } from '@interface-technologies/iti-react'

export const api = {
    product,
    log,
    user,
}

// for easy debugging
;(window as any).api = api
;(window as any).formatUrlParams = formatUrlParams
