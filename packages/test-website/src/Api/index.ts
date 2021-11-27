import { productApi } from './productApi'
import { userApi, userQueryKeys } from './userApi'
import { ApiMethods, get, post } from './util'

const apiMethods: ApiMethods = { get, post }

export const api = {
    user: userApi(apiMethods),
    product: productApi(apiMethods),
}

export const queryKeys = {
    user: userQueryKeys,
}
