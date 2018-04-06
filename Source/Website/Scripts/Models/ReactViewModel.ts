


import { UserDto } from './UserDto';
import { ViewModel } from './ViewModel';


export const ReactViewModelTypeName = 'ReactViewModel'
export interface ReactViewModel  { 
	Page: string
	BaseUrl: string
	ViewModel: ViewModel
}
