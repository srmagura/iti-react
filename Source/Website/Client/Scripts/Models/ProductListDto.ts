


import { ProductDto } from './ProductDto';


export const ProductListDtoTypeName = 'ProductListDto'
export interface ProductListDto  { 
	products: ProductDto[]
	totalPages: number
}
