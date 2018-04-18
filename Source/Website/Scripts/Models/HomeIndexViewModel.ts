


import { UserDto } from './UserDto';
import { ErrorDto } from './ErrorDto';
import { ViewModel } from './ViewModel';


export const HomeIndexViewModelTypeName = 'HomeIndexViewModel'
export interface HomeIndexViewModel extends ViewModel { 
	user: UserDto
}
