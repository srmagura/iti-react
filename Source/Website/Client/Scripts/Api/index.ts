import { productApi as product } from 'Api/ProductApi'
import { logApi as log } from 'Api/LogApi'

export const api = {
    product,
    log
}

// for easy debugging
;(window as any).api = api
