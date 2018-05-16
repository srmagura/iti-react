import { ProductDto, ProductListDto } from 'Models'
import { formatUrlParams } from 'Util/UrlUtil';
import { get, post, postCore } from 'Util/ApiUtil';

export const api = {
    product: {
        list: (data: {
            name: string
            page: number
            pageSize: number
        }) =>
            get<ProductListDto>('api/product/list', data),

        get: (data: { id: number }) =>
            get<ProductDto>('api/product/get', data),

        internalServerError: (data: {}) =>
            get<void>('api/product/internalServerError', data),

        isValid: (data: { s: string }) =>
            get<{ valid: boolean, reason: string }>('api/product/isValid', data)
    }
}