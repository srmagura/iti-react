import { productApi } from './productApi'
import { userApi } from './userApi'
import { ApiMethods, get, post } from './util'

const apiMethods: ApiMethods = { get, post }

export const api = {
    user: userApi(apiMethods),
    product: productApi(apiMethods),
}
