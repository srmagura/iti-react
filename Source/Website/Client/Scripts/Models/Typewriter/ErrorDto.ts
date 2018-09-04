


import { ProductDto } from './ProductDto';
import { ProductListDto } from './ProductListDto';

import { ErrorType } from './ErrorType'

export const ErrorDtoTypeName = 'ErrorDto'
export interface ErrorDto  { 
	errorType: ErrorType | null
	message: string
	diagnosticInformation: string
}
