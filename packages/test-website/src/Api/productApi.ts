import { ProductDto } from 'models'
import { ApiMethods } from './util'

export function productApi({ get }: ApiMethods) {
    return {
        list: (options: { name: string | undefined }) =>
            get<ProductDto[]>('api/product/list', options),
    }
}
