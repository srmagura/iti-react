


import { ProductDto } from './ProductDto';

import { 
    ErrorDtoType
} from '.'

export const ProductListDtoTypeName = 'ProductListDto'
export interface ProductListDto  { 
	products: ProductDto[]
	totalPages: number
}
