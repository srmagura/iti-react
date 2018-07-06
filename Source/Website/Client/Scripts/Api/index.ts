import { productApi as product } from 'Api/ProductApi'
import { logApi as log } from 'Api/LogApi'
import { userApi as user } from 'Api/UserApi'

export const api = {
    product,
    log,
    user
}

// for easy debugging
;(window as any).api = api
