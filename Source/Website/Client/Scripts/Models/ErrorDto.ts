


import { ProductDto } from './ProductDto';
import { ProductListDto } from './ProductListDto';


export const ErrorDtoTypeName = 'ErrorDto'
export interface ErrorDto  { 
	message: string
	diagnosticInformation: string
}
