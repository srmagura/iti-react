import { ProductDto } from 'Models'
import { formatUrlParams } from 'Util/UrlUtil';
import { get, post, postCore } from 'Util/ApiUtil';

export const api = {
    product: {
        list: () =>
            get<ProductDto[]>('api/product/list'),
        get: (id: number) => {
            const qs = formatUrlParams({ id })
            return get<ProductDto>('api/product/get' + qs)
        },
        internalServerError: () =>
            get<void>('api/product/internalServerError'),
        isValid: (s: string) => {
            const qs = formatUrlParams({ s })
            type T = { valid: boolean, reason: string }
            return get<T>('api/product/isValid' + qs)
        }
    }
}