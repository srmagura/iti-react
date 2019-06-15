



import { 
    ErrorDtoType
} from '.'

export const UserLogInDtoTypeName = 'UserLogInDto'
export interface UserLogInDto  { 
	accessToken: string
	expiresUtc: Date
}
