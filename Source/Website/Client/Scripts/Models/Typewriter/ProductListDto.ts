


import { ProductDto } from './ProductDto';

import { ErrorType } from './ErrorType'

export const ProductListDtoTypeName = 'ProductListDto'
export interface ProductListDto  { 
	products: ProductDto[]
	totalPages: number
}
