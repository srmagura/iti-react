


import { ProductDto } from './ProductDto';
import { ProductListDto } from './ProductListDto';
import { ErrorDto } from './ErrorDto';
import { UserDto } from './UserDto';
import { EmailAddress } from './EmailAddress';

import { ErrorType } from './ErrorType'

export const UserLogInDtoTypeName = 'UserLogInDto'
export interface UserLogInDto  { 
	accessToken: string
	expiresUtc: Date
}
