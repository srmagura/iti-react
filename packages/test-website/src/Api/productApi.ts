import { ProductDto } from 'models'
import { ApiMethods } from './util'

export function productApi({ get, post }: ApiMethods) {
    return {
        list: (options: { name: string | undefined }) =>
            get<ProductDto[]>('api/product/list', options),

        isValid: (options: { s: string }) =>
            get<{ valid: boolean; reason: string }>('api/product/isValid', options),

        isValid2: (options: { s: string }) =>
            get<{ valid: boolean; reason: string }>('api/product/isValid2', options),

        performOperation: (options: { error: boolean }) =>
            post<void>('api/product/performOperation', options),
    }
}
