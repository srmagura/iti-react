


import { UserDto } from './UserDto';
import { ViewModel } from './ViewModel';


export const HomeIndexViewModelTypeName = 'HomeIndexViewModel'
export interface HomeIndexViewModel extends ViewModel { 
	User: UserDto
}
